const nodemailer = require('nodemailer');
const { SMTP_USERNAME, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT } = require('../utils/globals');

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});

const sendEmail = (to, subject, body) => {
  //   const mailOptions = {
  //     from: 'your_email@gmail.com',
  //     to: to,
  //     subject: subject,
  //     html: body,
  //   };

  var mailOptions = {
    from: 'Joyboy',
    to: 'jishankhannew@gmail.com',
    subject: 'Nice Nodemailer test',
    text: 'Hey there, it’s our first message sent with Nodemailer ;) ',
    html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer',
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = { sendEmail };
