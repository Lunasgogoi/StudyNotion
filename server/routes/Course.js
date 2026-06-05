const express = require("express");
const router = express.Router();


// ================================
// Course Controllers Import
// ================================
const {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getInstructorCourses,
} = require("../controllers/Course");

const {deleteCourse} = require("../controllers/Course")

// console.log({
//   createCourse,
//   getAllCourses,
//   getCourseDetails,
//   createSection,
//   createSubSection,
//   createRating,
//   getAllRatingsAndReviews
// });

// ================================
// Categories Controllers Import
// ================================
const {
    getAllCategories,
    createCategory,
    categoryPageDetails,
} = require("../controllers/Category");


// ================================
// Sections Controllers Import
// ================================
const {
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section");


// ================================
// Sub-Sections Controllers Import
// ================================
const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require("../controllers/Subsection");


// ================================
// Rating Controllers Import
// ================================
const {
    createRating,
    getAverageRating,
    getAllRatingsAndReviews,
} = require("../controllers/RatingsAndReview");


// ================================
// Importing Middlewares
// ================================
const {
    auth,
    isInstructor,
    isStudent,
    isAdmin,
} = require("../middlewares/auth");


// ************************************************************************************************
//                                      Course routes
// ************************************************************************************************

// Courses can only be created by instructors
router.post("/createCourse", auth, isInstructor, createCourse);

// Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);

// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);

// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);

router.delete("/deleteCourse", auth, isInstructor, deleteCourse);

// ================================
// SubSection routes
// ================================

// Add a SubSection
router.post("/addSubSection", auth, isInstructor, createSubSection);

// Update a SubSection
router.post("/updateSubSection", auth, isInstructor, updateSubSection);

// Delete a SubSection
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);


// ================================
// Course fetching routes
// ================================

// Get all courses
router.get("/getAllCourses", getAllCourses);

// Get course details
router.post("/getCourseDetails", getCourseDetails);

// Get instructor courses
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);


// ************************************************************************************************
//                                      Category routes
// ************************************************************************************************

// Create Category (Admin only)
router.post("/createCategory", auth, isAdmin, createCategory);

// Get all categories
router.get("/showAllCategories", getAllCategories);

// Get category page details
router.post("/getCategoryPageDetails", categoryPageDetails);


// ************************************************************************************************
//                                      Rating and Review
// ************************************************************************************************

// Create Rating (Student only)
router.post("/createRating", auth, isStudent, createRating);

// Get average rating
router.get("/getAverageRating", getAverageRating);

// Get all reviews
router.get("/getReviews", getAllRatingsAndReviews);;


// Export the router
module.exports = router;