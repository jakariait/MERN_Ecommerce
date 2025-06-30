const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text }) => {
  let transporter = nodemailer.createTransport({
    service: "Gmail", // or your email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
