const Course = require("../models/Course");
const User = require("../models/User");
const Tag = require("../models/Tag");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//createCourse handler function

exports.createCourse = async (req, res) => {
    try {

        //fetch data from req.body
        const { courseName, courseDescription, whatYouWillLearn, coursePrice, courseTags } = req.body;
        //fetch thumbnail from req.files
        const thumbnail = req.files.thumbnailImage;

        //validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !coursePrice || !courseTags || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);

        //TODO : verify that userId and instructorId are same or not,
        //  to avoid fake token usage for course creation by other users

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found",
            });
        }

        if (instructorDetails.accountType !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "Only instructors are allowed to create course",
            });
        }

        //check if given tag is valid or not

        const tagDetails = await Tag.find(tag);
        if (!tagDetails || tagDetails.length === 0) {
            return res.status(400).json({
                success: false,
                message: "One or more tags are invalid",
            });
        }

        //Upload thumbnail to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);


        // create an entry for a new course

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            coursePrice,
            courseTags,
            instructor: instructorDetails._id,
            thumbnail: thumbnailImage.secure_url,
            tag: tagDetails.map((tag) => tag._id),
        });

        //add the new course to the user schema of instructor

        await User.findByIdAndUpdate(
            { _id: instructorSetails._id },
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            { new: true },
        );

        //update then tag schema with the course id
        await Tag.updateMany(
            { _id: { $in: tagDetails.map((tag) => tag._id) } },
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            { new: true },
        );

        //return response
        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            newCourse,
        });


    } catch (error) {
        console.log("Error in createCourse controller", error);
        return res.status(500).json({
            success: false,
            message: "Error in creating course",
        });
    }
};


//getAllCourses handler function

exports.getAllCourses = async (req, res) => {
    try {
        //get id
        const { courseId } = req.body;
        //find course details
        const courseDetails = await Course.find({
            _id: courseId
        }).populate(
            {
                path: "instructor",
                populate: {
                    path: "additonalDetails",
                },
            }
        )
            .populate("category")
            .populate("ratingsAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            })

        //validation
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `could not find course wiht ${courseId}`,
            });

            
        }
        //return response
        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            courseDetails,
        });

    } catch (error) {
    console.log("Error in getAllCourses controller", error);
    return res.status(500).json({
        success: false,
        message: "Error in fetching courses",
    });
}
};