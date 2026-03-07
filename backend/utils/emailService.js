const nodemailer = require('nodemailer');
const { getUserById } = require('../models/userModel');

// Configure the email transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendConfirmationEmail(userId, orderId) {
  try {

    console.log('userId',userId)
   
    const userQuery = await getUserById(userId);
    console.log('userQuery',userQuery)
    
    if (userQuery.email.length === 0) {
      console.log('Email not sent: User not found.');
      return;
    }

    const userEmail = userQuery.email;
    const userName = userQuery.name || 'Customer';

    // 2. Define the email content
    const mailOptions = {
      from: `"ShopEase" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Order Confirmation - #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563EB;">Payment Successful!</h2>
          <p>Hi ${userName},</p>
          <p>Thank you for your purchase. Your payment has been successfully processed.</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Order ID:</strong> ${orderId}</p>
            <p style="margin: 5px 0 0 0;"><strong>Status:</strong> PAID</p>
          </div>
          <p>We are getting your items ready for shipment.</p>
          <p>Thanks,<br>The ShopEase Team</p>
        </div>
      `,
    };

    // 3. Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Confirmation email sent to ${userEmail} (Message ID: ${info.messageId})`);

  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }
}



const sendEmail = async (to, subject, text) => {
  try {
   let info = await transporter.sendMail({
      from: `"E-Commerce App" <${"anandsinghtomar25@gmail.com"}>`,
      to,
      subject,
      text
    });
    console.log('Message sent: %s', info.messageId);
    if (nodemailer.getTestMessageUrl(info)) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

module.exports = { sendEmail , sendConfirmationEmail };
