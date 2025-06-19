const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "add host",
  secure: true, 
  auth: {
    user: "add email",
    pass: "add your password",
  },
});

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: 'add sender email',
            to,
            subject,
            html
        });
        console.log(`Email sent to ${to}`);
    } catch (err) {
        console.error(`Failed to send email to ${to}:`, err);
    }
};

module.exports = sendEmail;
