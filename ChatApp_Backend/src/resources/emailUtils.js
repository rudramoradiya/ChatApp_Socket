const { title } = require('process');
const transporter = require('../config/nodemailer.js');
const {
  DEFAULT_FROM,
  EMAIL_SUBJECT,
  EMAIL_TEMPLATES,
} = require('../constants/emailConstants'); 
const ejs = require('ejs'); 
const path = require('path'); 

const sendOtpEmail = async (recipient, otp, username = "User") => {
  try {
    // Render EJS template
    const templatePath = path.join(
      __dirname,
      "../templates",
      EMAIL_TEMPLATES.VERIFICATION_EMAIL
    );
    const html = await ejs.renderFile(templatePath, { otp, username });

    const mailOptions = {
      title: "Storage Management System",
      from: DEFAULT_FROM,
      to: recipient,
      subject: EMAIL_SUBJECT.VERIFICATION_EMAIL,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

module.exports = {
  sendOtpEmail,

};