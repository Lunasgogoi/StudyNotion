const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course"); // needed for enrolled courses
const CourseProgress = require("../models/CourseProgress");

const parseDurationToSeconds = (duration) => {
    if (duration === undefined || duration === null || duration === "") return 0;

    if (typeof duration === "number") {
        return Number.isFinite(duration) ? Math.max(0, duration) : 0;
    }

    const normalized = String(duration).trim();
    if (!normalized) return 0;

    if (normalized.includes(":")) {
        const parts = normalized.split(":").map((part) => Number(part));
        if (parts.some((part) => Number.isNaN(part))) return 0;
        return parts.reduce((total, part) => total * 60 + part, 0);
    }

    const numericDuration = Number(normalized);
    return Number.isFinite(numericDuration) ? Math.max(0, numericDuration) : 0;
};

const getCourseMetrics = (courseContent = []) => {
    return courseContent.reduce(
        (metrics, section) => {
            const lectures = section?.subSection || [];
            metrics.totalNoOfLectures += lectures.length;
            metrics.totalDurationInSeconds += lectures.reduce(
                (total, lecture) => total + parseDurationToSeconds(lecture?.timeDuration || lecture?.duration),
                0
            );
            return metrics;
        },
        { totalNoOfLectures: 0, totalDurationInSeconds: 0 }
    );
};

// ================================
// UPDATE PROFILE
// ================================
exports.updateProfile = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            dateOfBirth,
            about,
            contactNumber,
            gender,
        } = req.body;

        const id = req.user.id;

        if (!firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: "First name and last name are required",
            });
        }

        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const profileId = userDetails.additionalDetails;

        const profileDetails = await Profile.findById(profileId);
        if (!profileDetails) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        userDetails.firstName = firstName;
        userDetails.lastName = lastName;

        profileDetails.dateOfBirth = dateOfBirth || null;
        profileDetails.about = about || "";
        profileDetails.contactNumber = contactNumber || "";
        profileDetails.gender = gender || "";

        await userDetails.save();
        await profileDetails.save();

        const updatedUserDetails = await User.findById(id).populate("additionalDetails");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUserDetails,
        });

    } catch (error) {
        console.log("Error in updateProfile:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ================================
// DELETE ACCOUNT
// ================================
exports.deleteAccount = async (req, res) => {
    try {
        const id = req.user.id;

        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // delete profile
        await Profile.findByIdAndDelete(userDetails.additionalDetails);

        // remove user from enrolled courses
        await Course.updateMany(
            { studentsEnrolled: id },
            { $pull: { studentsEnrolled: id } }
        );

        // delete user
        await User.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });

    } catch (error) {
        console.log("Error in deleteAccount:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ================================
// GET ALL USER DETAILS
// ================================
exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;

        const userDetails = await User.findById(id)
            .populate("additionalDetails");

        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            data: userDetails,
        });

    } catch (error) {
        console.log("Error in getAllUserDetails:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ================================
// UPDATE DISPLAY PICTURE (MISSING)
// ================================
exports.updateDisplayPicture = async (req, res) => {
    try {
        const id = req.user.id;

        console.log("FILES:", req.files);

        // Validation: Check if file is uploaded
        if (!req.files || !req.files.displayPicture) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded or file key is incorrect",
            });
        }

        const displayPicture = req.files.displayPicture;

        // Upload to Cloudinary
        const { uploadImageToCloudinary } = require("../utils/imageUploader");
        const uploadDetails = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME
        );

        // Update User AND Populate
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { image: uploadDetails.secure_url },
            { new: true } // 🔥 Fixed Mongoose syntax
        ).populate("additionalDetails"); // 🔥 Added populate so frontend doesn't break!

        return res.status(200).json({
            success: true,
            message: "Display picture updated successfully",
            data: updatedUser,
        });

    } catch (error) {
        console.log("Error in updateDisplayPicture:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================================
// GET ENROLLED COURSES
// ================================
exports.getEnrolledCourse = async (req, res) => {
    try {
        const userId = req.user.id;

        const userDetails = await User.findOne({ _id: userId })
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "subSection",
                    },
                },
            })
            .exec()

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const progressDocs = await CourseProgress.find({
            userId,
            courseId: { $in: userDetails.courses.map((course) => course._id) },
        }).lean();

        const progressByCourseId = new Map(
            progressDocs.map((progress) => [progress.courseId.toString(), progress])
        );

        const coursesWithProgress = userDetails.courses.map((course) => {
            const courseObject = course.toObject();
            const metrics = getCourseMetrics(courseObject.courseContent);
            const progress = progressByCourseId.get(courseObject._id.toString());
            const completedVideos = (progress?.completedVideos || []).map((id) => id.toString());
            const completedLecturesCount = completedVideos.length;
            const progressPercentage = metrics.totalNoOfLectures > 0
                ? Math.round((completedLecturesCount / metrics.totalNoOfLectures) * 100)
                : 0;

            return {
                ...courseObject,
                ...metrics,
                completedVideos,
                completedLecturesCount,
                progressPercentage,
            };
        });

        return res.status(200).json({
            success: true,
            message: "Enrolled courses fetched successfully",
            data: coursesWithProgress,
        });

    } catch (error) {
        console.log("Error in getEnrolledCourse:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// for the instructor dashboard, we need to fetch all courses created by the instructor and also calculate the total students enrolled and total amount generated for each course. This will help the instructor to get an overview of their courses and earnings.

exports.instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id });

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length;
            const totalAmountGenerated = totalStudentsEnrolled * course.price;

            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated,
            };
            return courseDataWithStats;
        });

        res.status(200).json({
            courses: courseData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
