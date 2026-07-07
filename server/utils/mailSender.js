const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        const { MAIL_HOST, MAIL_USER, MAIL_PASS, MAIL_PORT, MAIL_SECURE } = process.env;

        if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
            throw new Error("Email service is not configured. Set MAIL_HOST, MAIL_USER, and MAIL_PASS.");
        }

        const transporter = nodemailer.createTransport({
            host: MAIL_HOST,
            port: Number(MAIL_PORT) || 587,
            secure: MAIL_SECURE === "true",
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASS,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });

        return transporter.sendMail({
            from: `"StudyNotion" <${MAIL_USER}>`,
            to: email,
            subject: title,
            html: body,
        });
    } catch (error) {
        console.log("Mail Sender Error:", error.message);
        throw error;
    }
};

module.exports = mailSender;
