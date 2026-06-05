const nodemailer = require("nodemailer");

const mailSender = async (Email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        let info = await transporter.sendMail({
            from: 'StudyNotion || CodeHelp - by Babbar',
            to: Email,          // ✅ FIXED
            subject: title,     // ✅ FIXED
            html: body,         // ✅ FIXED
        });

        return info; // ✅ important for logging
    }
    catch (error) {
        console.log("Mail Sender Error:", error);
        throw error; // better to throw
    }
}

module.exports = mailSender;