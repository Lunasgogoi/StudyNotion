
//createCourse handler function
const mongoose = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Category");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const jwt = require("jsonwebtoken");

exports.createCourse = async (req, res) => {
    try {

        // =========================
        // FILE VALIDATION
        // =========================

        if (!req.files || !req.files.thumbnailImage) {
            return res.status(400).json({
                success: false,
                message: "Thumbnail image is required",
            });
        }

        const thumbnail = req.files.thumbnailImage;

        // =========================
        // BODY DATA
        // =========================

        let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            coursePrice,
            courseTags,
            category,
        } = req.body;

        // =========================
        // SANITIZE INPUTS
        // =========================

        courseName = courseName?.trim();
        courseDescription = courseDescription?.trim();
        whatYouWillLearn = whatYouWillLearn?.trim();
        category = category?.trim();

        // =========================
        // REQUIRED FIELD VALIDATION
        // =========================

        if (
            !courseName ||
            !courseDescription ||
            !coursePrice ||
            !category
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        // =========================
        // OBJECT ID VALIDATION
        // =========================

        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID",
            });
        }

        // =========================
        // CHECK CATEGORY EXISTS
        // =========================

        const categoryDetails = await Category.findById(category);

        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // =========================
        // CHECK INSTRUCTOR
        // =========================

        const userId = req.user.id;

        const instructorDetails = await User.findById(userId);

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found",
            });
        }

        if (instructorDetails.accountType !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "Only instructors can create courses",
            });
        }

        // =========================
        // TAGS HANDLING
        // =========================

        let tags = [];

        if (Array.isArray(courseTags)) {
            tags = courseTags;
        }
        else if (typeof courseTags === "string") {
            try {
                const parsedTags = JSON.parse(courseTags);
                tags = Array.isArray(parsedTags) ? parsedTags : [];
            } catch (error) {
                tags = courseTags
                    .split(",")
                    .map(tag => tag.trim())
                    .filter(tag => tag.length > 0);
            }
        }

        if (tags.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one tag is required",
            });
        }

        // =========================
        // IMAGE UPLOAD
        // =========================

        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
        );

        // =========================
        // CREATE COURSE
        // =========================

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price: Number(coursePrice),
            category,
            courseTags: tags,
            instructor: instructorDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });

        // =========================
        // UPDATE USER
        // =========================

        await User.findByIdAndUpdate(
            instructorDetails._id,
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        );

        // =========================
        // UPDATE CATEGORY
        // =========================

        await Category.findByIdAndUpdate(
            category,
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        );

        // =========================
        // RESPONSE
        // =========================

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
        });

    } catch (error) {

        console.error("CREATE COURSE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        });
    }
};

//getAllCourses handler function

exports.getAllCourses = async (req, res) => {
    try {
        // Fetch all courses
        const courses = await Course.find({})
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails", // ✅ fixed typo
                },
            })
            .populate("category")
            .populate("ratingsAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            });

        // Validation
        if (!courses || courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses found",
            });
        }

        // Success response
        return res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            data: courses,
        });

    } catch (error) {
        console.error("Error in getAllCourses:", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching courses",
        });
    }
};
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;

        const courseDetails = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingsAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find course with id ${courseId}`,
            });
        }

        let completedVideos = [];
        const token = req.cookies?.token ||
            req.header("Authorization")?.replace("Bearer ", "") ||
            req.body.token;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const courseProgress = await CourseProgress.findOne({
                    courseId,
                    userId: decoded.id,
                });

                completedVideos = courseProgress?.completedVideos || [];
            } catch (error) {
                completedVideos = [];
            }
        }

        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails,
            completedVideos,
        });

    } catch (error) {
        console.log("Error in getCourseDetails:", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching course details",
        });
    }
};

exports.getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user.id;

        const instructorCourses = await Course.find({
            instructor: instructorId,
        })
            .populate("category")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "Instructor courses fetched successfully",
            data: instructorCourses,
        });
    } catch (error) {
        console.log("Error in getInstructorCourses:", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching instructor courses",
        });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        // 1. Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // 2. Un-enroll students from the course
        // (Assuming you have a studentsEnrolled array in your Course model)
        const studentsEnrolled = course.studentsEnrolled || [];
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, {
                $pull: { courses: courseId },
            });
        }

        // 3. Remove from Instructor's course list
        await User.findByIdAndUpdate(course.instructor, {
            $pull: { courses: courseId },
        });

        // 4. Remove the course from Category
        await Category.findByIdAndUpdate(course.category, {
            $pull: { courses: courseId },
        });

        // 5. Delete sections and sub-sections
        const courseSections = course.courseContent || [];
        for (const sectionId of courseSections) {
            // Find the section to get its sub-sections
            const section = await Section.findById(sectionId);
            if (section) {
                const subSections = section.subSection || [];
                for (const subSectionId of subSections) {
                    await SubSection.findByIdAndDelete(subSectionId); // Delete sub-section
                }
            }
            // Delete the section
            await Section.findByIdAndDelete(sectionId);
        }

        // 6. Finally, delete the course itself
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });

    } catch (error) {
        console.error("DELETE COURSE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting course",
            error: error.message,
        });
    }
};
