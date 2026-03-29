const User = require("../models/User");
const mailSender = require("../utils/mailSender");



//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {
        //fetch email from req.body
        const { email } = req.body;

        //check user for this email , email validation

        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email",
            });
        }

        //generate token
        const token = crypto.randomBytes(32).toString("hex");

        //update user by token and token expiry time

        const updatedDetails = await User.findByIdAndUpdate(
            { email: email },
            {
                token: token,
                resetpasswordExpires: Date.now() + 3600000, //1 hour
            },
            { new: true }
        );

        //create reset password url
        const resetUrl = `http://localhost:3000/update-password?token=${token}`;

        //send email to user with reset password link containing token,
        //  url will be like this : http://localhost:3000/reset-password?token=xxxx

        await mailSender(email,
            "Reset Password",
            `Click on the link to reset your password: ${resetUrl}`);

        //return response
        return res.status(200).json({
            success: true,
            message: "Reset password link sent to your email",
        });

    } catch (error) {
        console.log("Error in resetPasswordToken controller", error);
        return res.status(500).json({
            success: false,
            message: "Error in resetPasswordToken controller",
        });
    }
}



//resetPassword

exports.resetPassword = async (req, res) => {
    try {
        //fetch token and new password from req.body
        const { password, confirmPassword, token } = req.body;

        //validation
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        //get userDetails from token and check if token is valid or not

        const userDetails = await User.findOne({
            token: token,
            resetpasswordExpires: { $gt: Date.now() }, //check if token is expired or not
        });

        //if no entry, invalid token
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        //token time check

        if (userDetails.resetpasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token has expired",
            });
        }

        //hash new password

        const hashedPassword = await bcrypt.hash(password, 10);

        //update user password and reset token and token expiry time

        await User.findByIdAndUpdate(
            { token: token },
            { password: hashedPassword },
            { new: true },
        );

        //return response
        return res.status(200).json({
            success: true,
            message: "Password reset successful",
        });


    } catch (error) {
        console.log("Error in resetPassword controller", error);
        return res.status(500).json({
            success: false,
            message: "Error in resetPassword controller",
        });
    }
}