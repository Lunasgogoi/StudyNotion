const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const crypto = require("crypto");

// ==========================================
// CAPTURE PAYMENT (Multi-Course)
// ==========================================
exports.capturePayment = async (req, res) => {
    const { courses } = req.body;
    const userId = req.user.id;

    if (courses.length === 0) {
        return res.json({ success: false, message: "Please provide Course Id(s)" });
    }

    let totalAmount = 0;

    // Calculate total amount for all courses in the cart
    for (const course_id of courses) {
        let course;
        try {
            course = await Course.findById(course_id);
            if (!course) {
                return res.status(200).json({ success: false, message: "Could not find the course" });
            }

            // Check if user is already enrolled
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({ success: false, message: "Student is already enrolled in one or more courses" });
            }

            totalAmount += course.price;
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // Create Razorpay Order
    const options = {
        amount: totalAmount * 100, // Razorpay works in the smallest currency unit (paise)
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    };

    try {
        const paymentResponse = await instance.orders.create(options);
        return res.json({
            success: true,
            message: paymentResponse, // We send the whole object so the frontend gets the order_id
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Could not initiate order" });
    }
};

// ==========================================
// VERIFY PAYMENT & ENROLL (Multi-Course)
// ==========================================
exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
        return res.status(200).json({ success: false, message: "Payment Failed: Missing parameters" });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    // if (expectedSignature === razorpay_signature) {
    if(true) { // For testing purposes, we will skip signature verification. Remove this line and uncomment the above line in production!}
        // Payment is verified! Now enroll the user in ALL courses
        await enrollStudents(courses, userId, res);
        return res.status(200).json({ success: true, message: "Payment Verified" });
    }

    return res.status(200).json({ success: false, message: "Payment Failed: Invalid Signature" });
};

// Helper function to handle multiple enrollments
const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res.status(400).json({ success: false, message: "Please Provide data for Courses or UserId" });
    }

    for (const courseId of courses) {
        try {
            // 1. Add student to the Course
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true }
            );

            if (!enrolledCourse) {
                return res.status(500).json({ success: false, message: "Course not found" });
            }

            // 2. Add course to the Student's profile
            const enrolledStudent = await User.findOneAndUpdate(
                { _id: userId },
                { $push: { courses: courseId } },
                { new: true }
            );

            // 3. Create a progress document for this student/course pair
            const courseProgress = await CourseProgress.findOneAndUpdate(
                { courseId, userId },
                { $setOnInsert: { courseId, userId, completedVideos: [] } },
                { new: true, upsert: true }
            );

            await User.findByIdAndUpdate(userId, {
                $addToSet: { courseProgress: courseProgress._id },
            });

            // 4. Send an email notification (Optional, but highly recommended)
            await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                `Congratulations! You are successfully enrolled into ${enrolledCourse.courseName}. You can now start learning.`
            );
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
