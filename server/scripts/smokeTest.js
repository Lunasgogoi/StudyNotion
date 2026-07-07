require("dotenv").config();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Course = require("../models/Course");
const Profile = require("../models/Profile");
const User = require("../models/User");

const BASE_URL = process.env.SMOKE_BASE_URL || "http://localhost:4000/api/v1";
const unique = Date.now();
const adminEmail = `smoke-admin-${unique}@example.com`;
const adminPassword = `SmokePass-${unique}`;

const results = [];
const cleanup = {
    users: [],
    courses: [],
};

const record = (name, passed, details = "") => {
    results.push({ name, passed, details });
    console.log(`${passed ? "PASS" : "FAIL"} ${name}${details ? ` - ${details}` : ""}`);
};

const request = async (path, options = {}) => {
    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
            ...(options.headers || {}),
        },
    });

    let body = null;
    try {
        body = await response.json();
    } catch (error) {
        body = null;
    }

    return { response, body };
};

const createTempAdmin = async () => {
    const profile = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: "Smoke test admin",
        contactNumber: null,
    });

    const admin = await User.create({
        firstName: "Smoke",
        lastName: "Admin",
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        accountType: "Admin",
        additionalDetails: profile._id,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=Smoke Admin`,
    });

    cleanup.users.push(admin._id.toString());
};

const cleanupTestData = async () => {
    for (const courseId of cleanup.courses) {
        await Course.findByIdAndDelete(courseId).catch(() => {});
    }

    for (const userId of cleanup.users) {
        const user = await User.findById(userId).catch(() => null);
        if (user) {
            await Profile.findByIdAndDelete(user.additionalDetails).catch(() => {});
            await User.findByIdAndDelete(userId).catch(() => {});
        }
    }
};

const main = async () => {
    await mongoose.connect(process.env.MONGODB_URL, { serverSelectionTimeoutMS: 10000 });
    await createTempAdmin();

    try {
        const health = await fetch(BASE_URL.replace("/api/v1", "/"));
        const healthBody = await health.json();
        record("server health", health.ok && healthBody.success === true);

        const categoriesResult = await request("/course/showAllCategories");
        const categories = categoriesResult.body?.data || [];
        record("fetch categories", categoriesResult.response.ok && Array.isArray(categories), `${categories.length} categories`);

        const coursesResult = await request("/course/getAllCourses");
        const courses = coursesResult.body?.data || [];
        const leaksPassword = JSON.stringify(courses).includes('"password"');
        record("fetch courses", coursesResult.response.ok && Array.isArray(courses), `${courses.length} courses`);
        record("public courses do not expose password hashes", !leaksPassword);

        const adminBlocked = await request("/admin/summary");
        record("admin summary requires auth", adminBlocked.response.status === 401);

        const login = await request("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email: adminEmail, password: adminPassword }),
        });
        const token = login.body?.token;
        record("admin login", login.response.ok && Boolean(token));

        const authHeaders = { Authorization: `Bearer ${token}` };

        const summary = await request("/admin/summary", { headers: authHeaders });
        record("admin summary", summary.response.ok && summary.body?.success === true);

        const users = await request("/admin/users", { headers: authHeaders });
        record("admin list users", users.response.ok && Array.isArray(users.body?.data), `${users.body?.data?.length || 0} users`);

        const tempStudentEmail = `smoke-student-${unique}@example.com`;
        const tempStudentPassword = "SmokeStudent123!";
        const createdStudent = await request("/admin/users", {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({
                firstName: "Smoke",
                lastName: "Student",
                email: tempStudentEmail,
                password: tempStudentPassword,
                accountType: "User",
            }),
        });
        const studentId = createdStudent.body?.data?._id;
        if (studentId) cleanup.users.push(studentId);
        record("admin create student", createdStudent.response.status === 201 && Boolean(studentId));

        const tempInstructorEmail = `smoke-instructor-${unique}@example.com`;
        const createdInstructor = await request("/admin/users", {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({
                firstName: "Smoke",
                lastName: "Instructor",
                email: tempInstructorEmail,
                password: "SmokeInstructor123!",
                accountType: "Instructor",
            }),
        });
        const instructorId = createdInstructor.body?.data?._id;
        if (instructorId) cleanup.users.push(instructorId);
        record("admin create instructor", createdInstructor.response.status === 201 && Boolean(instructorId));

        const adminCourses = await request("/admin/courses", { headers: authHeaders });
        record("admin list courses", adminCourses.response.ok && Array.isArray(adminCourses.body?.data), `${adminCourses.body?.data?.length || 0} courses`);

        const invalidCourse = await request("/admin/courses", {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({}),
        });
        record("admin create course validates thumbnail/body", invalidCourse.response.status === 400);

        const categoryId = categories[0]?._id;
        if (categoryId && instructorId && typeof FormData !== "undefined" && typeof Blob !== "undefined") {
            const pngBytes = Buffer.from(
                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
                "base64"
            );
            const formData = new FormData();
            formData.append("courseName", `Smoke Course ${unique}`);
            formData.append("courseDescription", "Temporary smoke test course");
            formData.append("whatYouWillLearn", "Smoke testing");
            formData.append("coursePrice", "1");
            formData.append("courseTags", "smoke,test");
            formData.append("instructions", "cleanup");
            formData.append("category", categoryId);
            formData.append("instructorId", instructorId);
            formData.append("thumbnailImage", new Blob([pngBytes], { type: "image/png" }), "smoke.png");

            const createdCourse = await request("/admin/courses", {
                method: "POST",
                headers: authHeaders,
                body: formData,
            });
            const courseId = createdCourse.body?.data?._id;
            if (courseId) cleanup.courses.push(courseId);
            record("admin create course", createdCourse.response.status === 201 && Boolean(courseId));

            if (courseId) {
                const studentLogin = await request("/auth/login", {
                    method: "POST",
                    body: JSON.stringify({ email: tempStudentEmail, password: tempStudentPassword }),
                });
                const studentToken = studentLogin.body?.token;
                record("student login", studentLogin.response.ok && Boolean(studentToken));

                if (studentToken) {
                    const studentHeaders = { Authorization: `Bearer ${studentToken}` };
                    const paymentOrder = await request("/payment/capturePayment", {
                        method: "POST",
                        headers: studentHeaders,
                        body: JSON.stringify({ courses: [courseId] }),
                    });
                    record(
                        "payment order capture",
                        paymentOrder.response.ok && paymentOrder.body?.success === true && Boolean(paymentOrder.body?.message?.id)
                    );

                    const invalidPayment = await request("/payment/verifyPayment", {
                        method: "POST",
                        headers: studentHeaders,
                        body: JSON.stringify({
                            razorpay_order_id: paymentOrder.body?.message?.id || "order_fake",
                            razorpay_payment_id: "pay_fake",
                            razorpay_signature: "00",
                            courses: [courseId],
                        }),
                    });
                    record("payment invalid signature rejected", invalidPayment.response.status === 400);
                }

                const deletedCourse = await request(`/admin/courses/${courseId}`, {
                    method: "DELETE",
                    headers: authHeaders,
                });
                cleanup.courses = cleanup.courses.filter((id) => id !== courseId);
                record("admin delete course", deletedCourse.response.ok && deletedCourse.body?.success === true);
            }
        } else {
            record("admin create/delete course", false, "missing category, instructor, FormData or Blob support");
        }

        if (studentId) {
            const deletedStudent = await request(`/admin/users/${studentId}`, {
                method: "DELETE",
                headers: authHeaders,
            });
            cleanup.users = cleanup.users.filter((id) => id !== studentId);
            record("admin delete student", deletedStudent.response.ok && deletedStudent.body?.success === true);
        }

        if (instructorId) {
            const deletedInstructor = await request(`/admin/users/${instructorId}`, {
                method: "DELETE",
                headers: authHeaders,
            });
            cleanup.users = cleanup.users.filter((id) => id !== instructorId);
            record("admin delete instructor", deletedInstructor.response.ok && deletedInstructor.body?.success === true);
        }
    } finally {
        await cleanupTestData();
        await mongoose.disconnect();
    }

    const failures = results.filter((result) => !result.passed);
    console.log(`\n${results.length - failures.length}/${results.length} checks passed`);
    if (failures.length > 0) {
        process.exit(1);
    }
};

main().catch(async (error) => {
    console.error("SMOKE TEST ERROR:", error.message);
    await cleanupTestData().catch(() => {});
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
});
