const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection"); // Added for deep delete

const isInstructorOwner = (course, instructorId) => {
    return course?.instructor?.toString() === instructorId?.toString();
};

const findOwnedCourseBySection = async (sectionId, instructorId) => {
    const course = await Course.findOne({ courseContent: sectionId });

    if (!course) {
        return { status: 404, message: "Course section not found" };
    }

    if (!isInstructorOwner(course, instructorId)) {
        return { status: 403, message: "You are not allowed to modify this course" };
    }

    return { course };
};

exports.createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;

        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required" // Changed 'error' to 'message' for consistency
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        if (!isInstructorOwner(course, req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to modify this course",
            });
        }

        const newSection = await Section.create({ sectionName });

        // Update course and populate to get full details back
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { courseContent: newSection._id } },
            { returnDocument: "after" }

        )
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection", // This handles the nested populate
                },
            })
            .exec();

        res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse, // Returning the full updated course is usually more helpful for the frontend
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create section",
            error: error.message
        });
    }
};

exports.updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId } = req.body;

        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing properties"
            });
        }

        const ownership = await findOwnedCourseBySection(sectionId, req.user.id);
        if (!ownership.course) {
            return res.status(ownership.status).json({
                success: false,
                message: ownership.message,
            });
        }

        const section = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { returnDocument: "after" }

        )
            .populate("subSection")
            .exec();

        res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: section,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update section",
        });
    }
};

exports.deleteSection = async (req, res) => {
    try {

        const { sectionId, courseId } = req.body; // Usually need courseId to return updated course

        if (!sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const ownership = await findOwnedCourseBySection(sectionId, req.user.id);
        if (!ownership.course) {
            return res.status(ownership.status).json({
                success: false,
                message: ownership.message,
            });
        }

        if (ownership.course._id.toString() !== courseId.toString()) {
            return res.status(400).json({
                success: false,
                message: "Section does not belong to the provided course",
            });
        }

        // Optional: Delete associated sub-sections first if they exist
        const section = await Section.findById(sectionId);
        if (section && section.subSection) {
            await SubSection.deleteMany({ _id: { $in: section.subSection } });
        }

        await Section.findByIdAndDelete(sectionId);

        // Update course - use courseId directly if available for better performance
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $pull: { courseContent: sectionId } },
            { returnDocument: "after" }
        )
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            data: updatedCourse // Frontend might need the updated list to refresh the UI
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete section",
        });
    }
};
