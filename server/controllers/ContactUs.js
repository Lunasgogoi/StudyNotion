const mailSender = require("../utils/mailSender");

exports.contactUsController = async (req, res) => {
  const { firstName, lastName, email, phoneNo, message } = req.body;

  try {
    // Send email to the Admin (You)
    await mailSender(
      process.env.MAIL_USER, // Your support email
      `New Contact Message from ${firstName} ${lastName}`,
      `You received a new message from ${email} (Phone: ${phoneNo}):\n\n${message}`
    );

    // Send Auto-Reply to the User
    await mailSender(
      email,
      "We received your message! - StudyNotion",
      `Hi ${firstName},\n\nThank you for reaching out! We have received your message and our team will get back to you shortly.\n\nYour Message:\n${message}`
    );

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact Us Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending your message.",
    });
  }
};