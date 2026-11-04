const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'mail.sayuree.com',
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: process.env.EMAIL_SECURE !== 'false',
    auth: {
      user: process.env.EMAIL_USER || 'otp@sayuree.com',
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Sayuree" <otp@sayuree.com>',
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
