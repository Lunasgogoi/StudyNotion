const express = require("express");
const router = express.Router();

const {
    createAdminCourse,
    createAdminUser,
    deleteAdminCourse,
    deleteAdminUser,
    getAdminCourses,
    getAdminSummary,
    getAdminUsers,
} = require("../controllers/Admin");

const { auth, isAdmin } = require("../middlewares/auth");

router.get("/summary", auth, isAdmin, getAdminSummary);

router.get("/users", auth, isAdmin, getAdminUsers);
router.post("/users", auth, isAdmin, createAdminUser);
router.delete("/users/:userId", auth, isAdmin, deleteAdminUser);

router.get("/courses", auth, isAdmin, getAdminCourses);
router.post("/courses", auth, isAdmin, createAdminCourse);
router.delete("/courses/:courseId", auth, isAdmin, deleteAdminCourse);

module.exports = router;
