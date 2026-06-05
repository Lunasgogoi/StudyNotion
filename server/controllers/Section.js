const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection"); // Added for deep delete

exports.createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;

        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required" // Changed 'error' to 'message' for consistency
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

        const section = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { returnDocument: "after" }

        );

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

        console.log("Request body for deleteSection:", req.body); // Debugging log to check incoming data

        const { sectionId, courseId } = req.body; // Usually need courseId to return updated course

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
        );

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