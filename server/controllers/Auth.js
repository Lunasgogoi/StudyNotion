const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");

const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




// ================================
// SEND OTP
// ================================
exports.sendotp = async (req, res) => {
    try {
        const { email } = req.body;

        // check if user already exists
        const userPresent = await User.findOne({ email });
        if (userPresent) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // generate OTP
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });

        // check unique OTP
        let result = await OTP.findOne({ otp });

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false,
            });
            result = await OTP.findOne({ otp });
        }

        // save OTP in DB
        await OTP.create({ email, otp });

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ================================
// SIGNUP
// ================================
exports.signup = async (req, res) => {
    try {
        const {
            email,
            firstName,
            lastName,
            password,
            confirmPassword,
            accountType = "User",
            contactNumber,
            otp,
        } = req.body;

        // validation
        if (!email || !firstName || !lastName || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        if (!["User", "Instructor"].includes(accountType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account type",
            });
        }

        // check user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // find latest OTP
        const recentOTP = await OTP.findOne({ email })
            .sort({ createdAt: -1 });

        if (!recentOTP) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        }

        if (otp !== recentOTP.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create profile
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        // create user
        const user = await User.create({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            accountType,
            contactNumber,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });
        const userData = user.toObject();
        delete userData.password;
        delete userData.token;

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user: userData,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ================================
// LOGIN
// ================================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email }).populate("additionalDetails");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        if (await bcrypt.compare(password, user.password)) {

            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            const userData = user.toObject();
            delete userData.password;
            delete userData.token;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                secure: process.env.NODE_ENV === "production",
            };

            return res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user: userData,
                message: "Login successful",
            });

        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// exports.sendotp = async (req, res) => {
//     try {
//         const { email } = req.body;
//         // check if user already exists
//         const userPresent = await User.findOne({ email });

//         if (userPresent) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists",
//             });
//         }

//         // generate OTP
//         let otp = otpGenerator.generate(6, {
//             upperCaseAlphabets: false,
//             specialChars: false,
//             lowerCaseAlphabets: false,
//         });

//         // save OTP to database
//         const otpDetails = await OTP.create({
//             email,
//             otp,
//         });

//         return res.status(200).json({
//             success: true,
//             message: "OTP sent successfully",
//             otp,
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// }


// ================================
// CHANGE PASSWORD (SECURE)
// ================================
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;

        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // find latest OTP for this email
        const recentOTP = await OTP.find({ email })
            .sort({ createdAt: -1 })
            .limit(1);

        if (recentOTP.length === 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        }

        if (otp !== recentOTP[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

//reset password
// exports.resetPassword = async (req, res) => {
//     try {
//         const { email, newPassword, confirmPassword } = req.body;

//         if (!email || !newPassword || !confirmPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required",
//             });
//         }    

//         if (newPassword !== confirmPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Passwords do not match",
//             });
//         }

//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         const hashedPassword = await bcrypt.hash(newPassword, 10);

//         user.password = hashedPassword;
//         await user.save();

//         return res.status(200).json({
//             success: true,
//             message: "Password updated successfully",
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };
