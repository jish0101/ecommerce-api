const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const { SMTP_USERNAME, SMTP_FROM, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT } = require('./globals');

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});

const templateList = {
  welcome: {
    name: 'welcome',
    subject: 'Welcome to Our App',
    path: 'welcome.ejs',
  },
  otp: {
    name: 'otp',
    subject: 'Email Verification',
    path: 'otp.ejs',
  },
  forgotPasswordOtp: {
    name: 'forgotPasswordOtp',
    subject: 'Forgot Password',
    path: 'forgotPasswordOtp.ejs',
  },
};

const renderTemplate = (templatePath, data) => {
  try {
    return ejs.renderFile(templatePath, data);
  } catch (error) {
    console.log('error => ', error);
    return error;
  }
};

const sendEmail = async (to, templateName, data) => {
  try {
    const templateInfo = templateList[templateName];

    if (!templateInfo) {
      console.error(`Template "${templateName}" not found.`);
      return false;
    }

    const templatePath = path.join(__dirname, '..', 'views', 'emailTemplates', templateInfo.path);
    const html = await renderTemplate(templatePath, data);
    const mailOptions = {
      from: SMTP_FROM,
      to,
      subject: templateInfo.subject,
      html,
    };

    await transport.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log('🚀 ~ sendEmail ~ error:', error);
    return false;
  }
};

module.exports = { sendEmail, templateList };
