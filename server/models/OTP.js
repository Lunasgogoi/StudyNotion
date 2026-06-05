const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/emailVerificationTemplate"); // ✅ ADD THIS

const OTPSchema = new mongoose.Schema({
     email: {
          type: String,
          required: true,
     },
     otp: {
          type: String,
          required: true,
     },
     createdAt: {
          type: Date,
          default: Date.now,
          expires: 300,
     },
});

// function to send email
async function sendVerification(email, otp) {
     try {
          const mailResponse = await mailSender(
               email,
               "Verification Email From StudyNotion",
               otpTemplate(otp)   // 🔥 FIX HERE
          );
          console.log("Email Sent Successfully", mailResponse);
     } catch (error) {
          console.log("Error while sending email", error);
          throw error;
     }
}

// pre-save hook
OTPSchema.pre("save", async function () {
     if (this.isNew) {
          await sendVerification(this.email, this.otp);
     }
});

module.exports = mongoose.model("OTP", OTPSchema);