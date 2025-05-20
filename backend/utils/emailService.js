const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your provider
  auth: {
    user: process.env.EMAIL_USER || "anandsinghtomar25@gmail.com",
    pass: process.env.EMAIL_PASS || "fiqg udql mfhr ijkm",
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"E-Commerce" <${"anandsinghtomar25@gmail.com"}>`,
      to,
      subject,
      text,
    });
    console.log('Message sent: %s', info.messageId);
    if (nodemailer.getTestMessageUrl(info)) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

module.exports = { sendEmail };
