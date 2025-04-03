require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📩 Email đã gửi đến: ${to}`);
    } catch (error) {
        console.error("❌ Lỗi gửi email:", error);
    }
};

module.exports = sendEmail;
