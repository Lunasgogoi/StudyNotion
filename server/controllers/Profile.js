const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
    try {
        //get data
        const { dateOfBirth = "", about = "", contactNumber = "", gender } = req.body;

        //get userID
        const id = req.user.id;

        //validation
        if (!contactNumber || !gender || !id) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;
        await profileDetails.save();

        //return response
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: profileDetails,
        });

    } catch (error) {
        console.log("Error in updateProfile middleware", error);
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified",
        });
    }
}

//explore->how can we schedule this delete operation crone job

//deleteAccount
exports.deleteAccount = async (req, res) => {
    try {
        //get ID
        const id = req.user.id;

        //valiation
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        //delete profile
        await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

        //delete user
        await User.findByIdAndDelete({ _id: id });

        //un-enroll user from all enrolled courses
        await User.updateMany({
            enrolledCourses: id
        },
            {
                $pull:
                {
                    enrolledCourses: id

                }
            });

        //return response
        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });

    } catch (error) {
        console.log("Error in deleteAccount middleware", error);
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified",
        });
    }
}

//get all details

exports.getAllUserDetails = async (req, res) => {
    try {
        //get ID
        const id = req.user.id;

        // get user details
        const userDetails = await User.findById(id).
            populate("additionalDetails");
        //validation
        
        //return response
        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            data: userDetails
        })
        
    } catch (error) {
        console.log("Error in getAllUserDetails middleware", error);
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified",
        });
    }
}