const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
     email: {
          type: String,
          required: true,
     },
     otp: {
          type: String,
          required: true,
     },
     craetedAt: {
          type: Date,
          default: Date.now,
          expires: 300, // OTP will expire after 5 minutes (300 seconds)
     },
});

//a function -> to send emails

async function sendVerification(email, otp) {
     try {
          const mailResponse = await mailSender(email,"Verification Email From StudyNotion", otp);
          console.log("Email Sent Successfully",mailResponse);
     } 
     catch (error) {
          console.log("error occured while sending email",error);
          throw error;
     }
}

OTPSchema.pre("save",async function(next) {
     await sendVerificationEmail((this.email, this.otp));
     next();
})

module.exports = mongoose.model("OTP", OTPSchema);
