// src/services/apis.js
export const LOCAL_BASE_URL = "http://localhost:4000/api/v1";
export const DEPLOYED_BASE_URL = "https://studynotion-emet.onrender.com/api/v1";

const isLocalFrontend =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

export const BASE_URL = isLocalFrontend ? LOCAL_BASE_URL : DEPLOYED_BASE_URL;

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
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

export const paymentEndpoints = {
  CAPTURE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  VERIFY_PAYMENT_API: BASE_URL + "/payment/verifyPayment",
}

export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails",
}

export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact", // Adjust to match your backend route
};

export const adminEndpoints = {
  ADMIN_SUMMARY_API: BASE_URL + "/admin/summary",
  ADMIN_USERS_API: BASE_URL + "/admin/users",
  ADMIN_COURSES_API: BASE_URL + "/admin/courses",
};
