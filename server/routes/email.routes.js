const nodemailer = require("nodemailer");

const sendEmail = async (to, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "🚨 Emergency Alert",
    text: message,
  });
};

module.exports = sendEmail;