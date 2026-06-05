const express = require("express");
const router = express.Router();

const { capturePayment, verifyPayment } = require("../controllers/Payments");
const { auth } = require("../middlewares/auth");

// We only use 'auth'. If we used 'auth, isStudent', Instructors would be blocked!
router.post("/capturePayment", auth, capturePayment);
router.post("/verifyPayment", auth, verifyPayment);

module.exports = router;