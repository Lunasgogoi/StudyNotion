const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const bcrypt = require("bcrypt");


// ========================
// RESET PASSWORD TOKEN
// ========================
exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        // check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email",
            });
        }

        // generate token
        const token = crypto.randomBytes(32).toString("hex");

        // save token + expiry in DB
        user.token = token;
        user.resetpasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // create reset URL
        const resetUrl = `http://localhost:3000/update-password?token=${token}`;

        // send mail
        await mailSender(
            email,
            "Reset Password",
            `Click on the link to reset your password: ${resetUrl}`
        );

        return res.status(200).json({
            success: true,
            message: "Reset password link sent to your email",
        });

    } catch (error) {
        console.log("Error in resetPasswordToken:", error);
        return res.status(500).json({
            success: false,
            message: "Error in resetPasswordToken controller",
        });
    }
};



// ========================
// RESET PASSWORD
// ========================
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        // validation
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        // find user with valid token
        const userDetails = await User.findOne({
            token,
            resetpasswordExpires: { $gt: Date.now() },
        });

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // update password and clear token
        userDetails.password = hashedPassword;
        userDetails.token = undefined;
        userDetails.resetpasswordExpires = undefined;

        await userDetails.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successful",
        });

    } catch (error) {
        console.log("Error in resetPassword:", error);
        return res.status(500).json({
            success: false,
            message: "Error in resetPassword controller",
        });
    }
};