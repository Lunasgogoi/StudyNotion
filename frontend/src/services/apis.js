// src/services/apis.js
const BASE_URL =  "https://studynotion-emet.onrender.com/api/v1";

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  UPDATE_COURSE_PROGRESS_API: BASE_URL + "/course/updateCourseProgress",
  SEARCH_COURSES_API: BASE_URL + "/course/search",
};

// RATINGS AND REVIEWS ENDPOINTS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
};

// AUTH ENDPOINTS (You might already have these somewhere, but good to move them here!)
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
};

// SETTINGS PAGE ENDPOINTS
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}

export const profileEndpoints = {
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourse",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
}

export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails",
}

export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact", // Adjust to match your backend route
};
