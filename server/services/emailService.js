const nodemailer = require('nodemailer');
require('dotenv').config();

// Zoho Mail Transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER || 'mailer@msinnovatics.com',
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('Email Service Error:', error);
    } else {
        console.log('Email Service Provider is ready');
    }
});

const sendMail = async ({ to, subject, html, text }) => {
    try {
        const info = await transporter.sendMail({
            from: `"MS Innovatics" <${process.env.EMAIL_USER || 'mailer@msinnovatics.com'}>`,
            to,
            subject,
            text, // plain text body
            html  // html body
        });
        console.log('Message sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendMail,
    transporter
};
