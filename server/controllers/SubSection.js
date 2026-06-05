const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
    try {

        // console.log("Request body:", req.body);
        console.log("FILES:", req.files);

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
        if (!subSectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        //update sub-section
        const updatedSubSection = await SubSection.findByIdAndUpdate(
            { _id: subSectionId },
            {
                title: title,
                timeDuration: timeDuration,
                description: description,
            },
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
