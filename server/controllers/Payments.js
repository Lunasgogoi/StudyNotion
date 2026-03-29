const { instance } = require("../config/razorpay");

const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { default: orders } = require("razorpay/dist/types/orders");
const crypto = require('crypto');

//capture the payment and initiate the Razorpay order 
exports.capturePayment = async (req, res) => {

    //get courseID and UserID
    const { courseID } = req.body;
    const userID = req.user.id;

    //validation
    //valid courseID
    if (!courseID || !userID) {
        return res.status(400).json({
            success: false,
            message: "Course ID is required",
        });
    }
    //valid courseDetail
    let course;
    try {
        course = await Course.findById(courseID);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        //user already enrolled in the course
        const uid = new mongoose.Types.ObjectId(userID);

        if (course.studentsEnrolled.includes(uid)) {
            return res.status(400).json({
                success: false,
                message: "User already enrolled in the course",
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }

    //create order
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.floor(Math.random() * 1000000000).toString(),
        notes: {
            courseID: courseID,
            userID,
        }
    };

    try {
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log("Payment Response: ", paymentResponse);

        //send response
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseThumbnail: course.thumbnail,
            courseDescription: course.courseDescription,
            orderID: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
            message: "Payment initiated successfully",
            data: paymentResponse,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

//verify Signature
const crypto = require("crypto");

exports.verifySignature = async (req, res) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["razorpay-signature"];

    const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(req.rawBody)
        .digest("hex");

    if (signature === expectedSignature) {
        console.log("Payment verified successfully");
        const { courseID, userID } = req.body.paylaod.entity.notes;

        try {
            //fulfill the action

            //find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseID },
                { $push: { studentsEnrolled: userID } },
                { new: true }
            );

            if(!enrolledCourse){
                return res.status(404).json({
                    success: false,
                    message: "Course not found",
                });
            }

            //find the student  and add the course
            //to the list of enrolled courses

            const enrolledStudent = await User.findOneAndUpdate(
                { _id: userID },
                { $push: { courses: courseID } },
                { new: true }
            );

            //mail the student about te enrollment
            const emailResponse = await mailSender({
                to: enrolledStudent.email,
                subject: "You have successfully enrolled in the course",
                html: courseEnrollmentEmail(enrolledStudent, enrolledCourse),
            });

            //return response
            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
            });

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: "Invalid signature",
        });
    }
};


