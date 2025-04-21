const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,       // email của bạn
        pass: process.env.EMAIL_PASS        // app password
    }
});

const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: `"Thông báo dạy bù" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
