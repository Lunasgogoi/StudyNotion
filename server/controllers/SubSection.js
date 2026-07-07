const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

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

const findOwnedCourseBySubSection = async (subSectionId, instructorId) => {
    const section = await Section.findOne({ subSection: subSectionId });

    if (!section) {
        return { status: 404, message: "Sub-section not found" };
    }

    const ownership = await findOwnedCourseBySection(section._id, instructorId);
    return { ...ownership, section };
};

exports.createSubSection = async (req, res) => {
    try {

        //fetch data from req body
        const { sectionId, title, timeDuration, description } = req.body;

        //extract file/video
        const video = req.files?.video;

        //validation
        if (!sectionId || !title || !timeDuration || !description  || !video) {
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

        //upload video to cloudinary -> we get secure url
        const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
        )
        //create a sub_section
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })

        //update section with this sub_section ObjectId

        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $push: {
                    subSection: SubSectionDetails._id
                }
            },
            { new: true }
        )
            .populate("subSection")
            .exec();

        //return response
        return res.status(200).json({
            success: true,
            message: "Sub-section created successfully",
            data: updatedSection,
        });

    } catch (error) {
        console.error("CREATE SUB-SECTION ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Error in creating sub-section",
            error: error.message,
        });
    }
} 

//update sub-section

exports.updateSubSection = async (req, res) => {
    try {

        //fetch data from req body
        const { subSectionId, title, timeDuration, description } = req.body;

        //validation
        if (!subSectionId || !title || timeDuration === undefined || timeDuration === null || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const ownership = await findOwnedCourseBySubSection(subSectionId, req.user.id);
        if (!ownership.course) {
            return res.status(ownership.status).json({
                success: false,
                message: ownership.message,
            });
        }

        const updateData = {
            title: title.trim(),
            timeDuration,
            description: description.trim(),
        };

        if (req.files?.video) {
            const uploadDetails = await uploadImageToCloudinary(
                req.files.video,
                process.env.FOLDER_NAME
            );
            updateData.videoUrl = uploadDetails.secure_url;
        }

        //update sub-section
        const updatedSubSection = await SubSection.findByIdAndUpdate(
            { _id: subSectionId },
            updateData,
            { new: true }
        );

        //return response
        return res.status(200).json({
            success: true,
            message: "Sub-section updated successfully",
            data: updatedSubSection,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in updating sub-section",
        })
    }
};

//delete sub-section

exports.deleteSubSection = async (req, res) => {
    try {    

        //fetch data from req body
        const { subSectionId, sectionId } = req.body;

        //validation
        if (!subSectionId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const ownership = await findOwnedCourseBySubSection(subSectionId, req.user.id);
        if (!ownership.course) {
            return res.status(ownership.status).json({
                success: false,
                message: ownership.message,
            });
        }

        if (ownership.section._id.toString() !== sectionId.toString()) {
            return res.status(400).json({
                success: false,
                message: "Sub-section does not belong to the provided section",
            });
        }

        //delete sub-section
        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

        //update section with this sub_section ObjectId
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId
                }
            },
            { new: true }
        )
            .populate("subSection")
            .exec();

        //return response
        return res.status(200).json({
            success: true,
            message: "Sub-section deleted successfully",
            data: updatedSection,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in deleting sub-section",
        });
    }
}
