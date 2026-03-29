const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//sendOTP
exports.sendOTP = async (req, res) => {

    try {
        //fetch email from req.body
        const { email } = req.body;

        //check if user already exists
        const userUserPresent = await User.findOne({ email });

        //id user already exists , then retrun a response

        if (checkUserPresent) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            })
        }

        //genearte OTP

        var OTP = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });
        console.log("OTP generated: ", OTP);

        //check unique otp or not
        const result = await OTP.findOne({ otp: OTP });

        while (result) {
            OTP = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false,
            });
            result = await OTP.findOne({ otp: OTP });
            console.log("OTP generated: ", OTP);
        }

        const otpPayload = {
            email: email,
            otp: OTP,
        };

        //create an entry in db for OTP
        const otpBody = await OTP.create(otpPayload);

        //return response

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};


//signup

exports.signUp = async (req, res) => {
    try {

        //fetch email, name, password and otp from req.body
        const { email,
            firstName,
            lastName,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp } = req.body;

        //validate 

        if (!email || !firstName || !lastName || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        // 2 password should be same
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password should be same",
            })
        }


        //check if user already exists
        const userPresent = await User.findOne({ email });

        if (userPresent) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            })
        }

        //find most recent OTP

        const recentOTP = await OTP.findOne({ email }).
            sort({ createdAt: -1 }).limit(1);

        //validate OTP
        if (recentOTP.length === 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            })

        } else if (otp !== recentOTP.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            })
        }

        //hash the password

        const hashedPassword = await bcrypt.hash(password, 10);

        //entry in DB

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            profileImage: null,

        })

        const user = await User.create({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            accountType,
            contactNumber,
            additionalDetails: profileDetails._id,
            image: 'https://api.dicebear.com/5.x/initials/svg?seed= + ${firstName} ${lastName}',
        });

        //return response

        return res.status(200).json({
            success: true,
            message: "User created successfully",
            user,
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//Login
exports.login = async (req, res) => {
    try {
        //fetch email and password from req.body
        const { email, password } = req.body;

        //validate
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //check if user exists
        const user = await User.findOne({ email }).populate("additionalDetails");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            })
        }

        //generate jwt , after pasword matching
        if (await bcrypt.compare(password, user.password)) {

            const payload = {
                email: user.email,
                id: user._id,
                role: user.role,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;

            //create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), //cookie will expire after 3 days
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                message: "Login successful",
                user,
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//changePassword 

exports.changePassword = async (req, res) => {
    try {

        //get data form req body
        const { email,
            oldPassword,
            newPassword,
            confirmPassword } = req.body;


        //get oldPassword, newPassword and confirmNewPassword from req.body



        //validation



        //update pwd in DB



        //send email -- passwrod updated



        //return response




    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}