const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");

// Import controllers
const {
    login,
    signup,
    sendotp,
    changePassword,
} = require("../controllers/Auth");

const {
    resetPasswordToken,
    resetPassword,
} = require("../controllers/ResetPassword");



// ************************************************************************************************
//                                      Authentication routes
// ************************************************************************************************

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signup);

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp);

// Route for changing the password (protected route)
router.post("/changepassword", auth, changePassword);


// ************************************************************************************************
//                                      Reset Password
// ************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);


// Export the router
module.exports = router;