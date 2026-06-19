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
OTPSchema.pre("save", async function (next) {
     if (this.isNew) {
          try {
               await sendVerification(this.email, this.otp);
          } catch (error) {
               console.error("OTP Pre-save Email Error:", error.message);
               // Don't block OTP creation even if email fails
               // Uncomment next line to block on email failure:
               // throw error;
          }
     }
     next();
});

module.exports = mongoose.model("OTP", OTPSchema);