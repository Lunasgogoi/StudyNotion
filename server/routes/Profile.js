const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");

const {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourse,
} = require("../controllers/Profile");

const Profile = require("../models/Profile");

const { instructorDashboard } = require("../controllers/Profile");


// Protected routes

router.get("/instructorDashboard", auth, instructorDashboard);

router.delete("/deleteAccount", auth, deleteAccount);

router.put("/updateProfile", auth, updateProfile);

router.get("/getAllUserDetails", auth, getAllUserDetails);

router.put("/updateDisplayPicture",auth, updateDisplayPicture);

router.get("/getEnrolledCourse", auth, getEnrolledCourse);

module.exports = router;