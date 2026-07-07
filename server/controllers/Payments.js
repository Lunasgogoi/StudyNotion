const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const crypto = require("crypto");

const createHttpError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const normalizeCourseIds = (courses) => {
    if (!Array.isArray(courses) || courses.length === 0) {
        throw createHttpError(400, "Please provide at least one course id");
    }

    const courseIds = courses.map((courseId) => String(courseId).trim());

    if (courseIds.some((courseId) => !mongoose.Types.ObjectId.isValid(courseId))) {
        throw createHttpError(400, "One or more course ids are invalid");
    }

    const uniqueCourseIds = [...new Set(courseIds)];

    if (uniqueCourseIds.length !== courseIds.length) {
        throw createHttpError(400, "Duplicate course ids are not allowed");
    }

    return uniqueCourseIds;
};

const isAlreadyEnrolled = (course, userId) => {
    return course.studentsEnrolled?.some(
        (studentId) => studentId.toString() === userId.toString()
    );
};

// ==========================================
// CAPTURE PAYMENT (Multi-Course)
// ==========================================
exports.capturePayment = async (req, res) => {
    try {
        const courseIds = normalizeCourseIds(req.body?.courses);
        const userId = req.user.id;

        const courses = await Course.find({ _id: { $in: courseIds } });

        if (courses.length !== courseIds.length) {
            return res.status(404).json({
                success: false,
                message: "Could not find one or more courses",
            });
        }

        const enrolledCourse = courses.find((course) => isAlreadyEnrolled(course, userId));
        if (enrolledCourse) {
            return res.status(409).json({
                success: false,
                message: "Student is already enrolled in one or more courses",
            });
        }

        const totalAmount = courses.reduce((sum, course) => sum + Number(course.price), 0);

        if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Course amount must be greater than zero",
            });
        }

        // Create Razorpay Order
        const options = {
            amount: Math.round(totalAmount * 100), // Razorpay works in the smallest currency unit (paise)
            currency: "INR",
            receipt: crypto.randomBytes(16).toString("hex"),
        };

        const paymentResponse = await instance.orders.create(options);
        return res.json({
            success: true,
            message: paymentResponse, // We send the whole object so the frontend gets the order_id
        });
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Could not initiate order",
        });
    }
};

// ==========================================
// VERIFY PAYMENT & ENROLL (Multi-Course)
// ==========================================
exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const userId = req.user.id;
    let courseIds;

    try {
        courseIds = normalizeCourseIds(req.body?.courses);
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message,
        });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
        return res.status(400).json({ success: false, message: "Payment failed: missing parameters" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const actualBuffer = Buffer.from(razorpay_signature, "hex");
    const isValidSignature =
        expectedBuffer.length === actualBuffer.length &&
        crypto.timingSafeEqual(expectedBuffer, actualBuffer);

    if (!isValidSignature) {
        return res.status(400).json({ success: false, message: "Payment failed: invalid signature" });
    }

    try {
        const enrollmentEmails = await enrollStudents(courseIds, userId);
        await sendEnrollmentEmails(enrollmentEmails);

        return res.status(200).json({ success: true, message: "Payment verified" });
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Could not complete enrollment",
        });
    }
};

// Helper function to handle multiple enrollments
const enrollStudents = async (courseIds, userId) => {
    const session = await mongoose.startSession();
    let enrollmentEmails = [];

    try {
        await session.withTransaction(async () => {
            const emailPayload = [];
            const enrolledStudent = await User.findById(userId).session(session);
            if (!enrolledStudent) {
                throw createHttpError(404, "User not found");
            }

            const courses = await Course.find({ _id: { $in: courseIds } }).session(session);
            if (courses.length !== courseIds.length) {
                throw createHttpError(404, "Could not find one or more courses");
            }

            const alreadyEnrolled = courses.find((course) => isAlreadyEnrolled(course, userId));
            if (alreadyEnrolled) {
                throw createHttpError(409, "Student is already enrolled in one or more courses");
            }

            for (const course of courses) {
                await Course.updateOne(
                    { _id: course._id },
                    { $addToSet: { studentsEnrolled: userId } },
                    { session }
                );

                await User.updateOne(
                    { _id: userId },
                    { $addToSet: { courses: course._id } },
                    { session }
                );

                const courseProgress = await CourseProgress.findOneAndUpdate(
                    { courseId: course._id, userId },
                    { $setOnInsert: { courseId: course._id, userId, completedVideos: [] } },
                    { new: true, upsert: true, session }
                );

                await User.updateOne(
                    { _id: userId },
                    { $addToSet: { courseProgress: courseProgress._id } },
                    { session }
                );

                emailPayload.push({
                    email: enrolledStudent.email,
                    courseName: course.courseName,
                });
            }

            enrollmentEmails = emailPayload;
        });

        return enrollmentEmails;
    } finally {
        await session.endSession();
    }
};

const sendEnrollmentEmails = async (enrollmentEmails) => {
    const emailResults = await Promise.allSettled(
        enrollmentEmails.map(({ email, courseName }) =>
            mailSender(
                email,
                `Successfully Enrolled into ${courseName}`,
                `Congratulations! You are successfully enrolled into ${courseName}. You can now start learning.`
            )
        )
    );

    emailResults
        .filter((result) => result.status === "rejected")
        .forEach((result) => console.log("Enrollment email failed:", result.reason?.message || result.reason));
};
