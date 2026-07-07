const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const Profile = require("../models/Profile");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

const parseListField = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof value !== "string") {
        return [];
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
        return [];
    }

    try {
        const parsedValue = JSON.parse(trimmedValue);
        return Array.isArray(parsedValue)
            ? parsedValue.map((item) => String(item).trim()).filter(Boolean)
            : [];
    } catch (error) {
        return trimmedValue
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }
};

const sanitizeUser = (user) => {
    const userData = user.toObject ? user.toObject() : user;
    delete userData.password;
    delete userData.token;
    return userData;
};

const deleteCourseById = async (courseId) => {
    const course = await Course.findById(courseId);
    if (!course) {
        return null;
    }

    const progressIds = await CourseProgress.find({ courseId }).distinct("_id");

    await User.updateMany(
        { courses: courseId },
        {
            $pull: {
                courses: courseId,
                courseProgress: { $in: progressIds },
            },
        }
    );

    await CourseProgress.deleteMany({ courseId });

    await Category.findByIdAndUpdate(course.category, {
        $pull: { courses: courseId },
    });

    for (const sectionId of course.courseContent || []) {
        const section = await Section.findById(sectionId);
        if (section) {
            await SubSection.deleteMany({ _id: { $in: section.subSection || [] } });
        }
        await Section.findByIdAndDelete(sectionId);
    }

    await Course.findByIdAndDelete(courseId);
    return course;
};

exports.getAdminSummary = async (req, res) => {
    try {
        const [totalUsers, totalStudents, totalInstructors, totalAdmins, totalCourses, totalCategories] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ accountType: "User" }),
            User.countDocuments({ accountType: "Instructor" }),
            User.countDocuments({ accountType: "Admin" }),
            Course.countDocuments(),
            Category.countDocuments(),
        ]);

        const revenueData = await Course.aggregate([
            {
                $project: {
                    revenue: {
                        $multiply: [
                            "$price",
                            { $size: { $ifNull: ["$studentsEnrolled", []] } },
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$revenue" },
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalStudents,
                totalInstructors,
                totalAdmins,
                totalCourses,
                totalCategories,
                totalRevenue: revenueData[0]?.totalRevenue || 0,
            },
        });
    } catch (error) {
        console.error("ADMIN SUMMARY ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Could not fetch admin summary",
        });
    }
};

exports.getAdminUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password -token")
            .populate("additionalDetails")
            .sort({ _id: -1 });

        return res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error("ADMIN USERS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Could not fetch users",
        });
    }
};

exports.createAdminUser = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            accountType = "User",
            contactNumber,
        } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "First name, last name, email and password are required",
            });
        }

        if (!["User", "Instructor"].includes(accountType)) {
            return res.status(400).json({
                success: false,
                message: "Admin can create only student or instructor accounts here",
            });
        }

        const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "A user with this email already exists",
            });
        }

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: contactNumber || null,
        });

        const user = await User.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            password: await bcrypt.hash(password, 10),
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: sanitizeUser(user),
        });
    } catch (error) {
        console.error("ADMIN CREATE USER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Could not create user",
        });
    }
};

exports.deleteAdminUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
            });
        }

        if (userId === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own admin account",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.accountType === "Admin") {
            return res.status(403).json({
                success: false,
                message: "Admin accounts cannot be deleted from this screen",
            });
        }

        if (user.accountType === "Instructor") {
            const instructorCourses = await Course.find({ instructor: userId }).select("_id");
            for (const course of instructorCourses) {
                await deleteCourseById(course._id);
            }
        }

        await Course.updateMany(
            { studentsEnrolled: userId },
            { $pull: { studentsEnrolled: userId } }
        );

        await CourseProgress.deleteMany({ userId });
        await Profile.findByIdAndDelete(user.additionalDetails);
        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("ADMIN DELETE USER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Could not delete user",
        });
    }
};

exports.getAdminCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate("instructor", "firstName lastName email accountType image")
            .populate("category", "name description")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: courses,
        });
    } catch (error) {
        console.error("ADMIN COURSES ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Could not fetch courses",
        });
    }
};

exports.createAdminCourse = async (req, res) => {
    try {
        if (!req.files || !req.files.thumbnailImage) {
            return res.status(400).json({
                success: false,
                message: "Thumbnail image is required",
            });
        }

        let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            coursePrice,
            courseTags,
            category,
            instructions,
            instructorId,
        } = req.body;

        courseName = courseName?.trim();
        courseDescription = courseDescription?.trim();
        whatYouWillLearn = whatYouWillLearn?.trim();
        category = category?.trim();
        instructorId = instructorId?.trim();

        if (!courseName || !courseDescription || !whatYouWillLearn || !coursePrice || !category || !instructorId) {
            return res.status(400).json({
                success: false,
                message: "All required course fields must be provided",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(category) || !mongoose.Types.ObjectId.isValid(instructorId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category or instructor id",
            });
        }

        const [categoryDetails, instructorDetails] = await Promise.all([
            Category.findById(category),
            User.findById(instructorId),
        ]);

        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        if (!instructorDetails || instructorDetails.accountType !== "Instructor") {
            return res.status(404).json({
                success: false,
                message: "Instructor not found",
            });
        }

        const tags = parseListField(courseTags);
        if (tags.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one tag is required",
            });
        }

        const price = Number(coursePrice);
        if (!Number.isFinite(price) || price < 0) {
            return res.status(400).json({
                success: false,
                message: "Course price must be a valid non-negative number",
            });
        }

        const uploadedThumbnail = await uploadImageToCloudinary(
            req.files.thumbnailImage,
            process.env.FOLDER_NAME
        );

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            category,
            courseTags: tags,
            instructions: parseListField(instructions),
            instructor: instructorDetails._id,
            thumbnail: uploadedThumbnail.secure_url,
            status: "Published",
        });

        await Promise.all([
            User.findByIdAndUpdate(instructorDetails._id, {
                $addToSet: { courses: newCourse._id },
            }),
            Category.findByIdAndUpdate(category, {
                $addToSet: { courses: newCourse._id },
            }),
        ]);

        const populatedCourse = await Course.findById(newCourse._id)
            .populate("instructor", "firstName lastName email accountType image")
            .populate("category", "name description");

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: populatedCourse,
        });
    } catch (error) {
        console.error("ADMIN CREATE COURSE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Could not create course",
        });
    }
};

exports.deleteAdminCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course id",
            });
        }

        const deletedCourse = await deleteCourseById(courseId);
        if (!deletedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        console.error("ADMIN DELETE COURSE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Could not delete course",
        });
    }
};
