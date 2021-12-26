'use strict';
const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
async function sendMail() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    security: 'STARTTLS',
    auth: {
      //   user: testAccount.user, // generated ethereal user
      //   pass: testAccount.pass, // generated ethereal password
      user: 'ztlaqyq2yg4aiu3k@ethereal.email',
      pass: 'f8uYG7WXrfSGMQ9hU6',
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'ztlaqyq2yg4aiu3k@ethereal.email', // sender address
    to: 'ztlaqyq2yg4aiu3k@ethereal.email', // list of receivers
    subject: 'Hello form node JS✔', // Subject line
    text: 'Hello world? this is a random text!!!', // plain text body
    html: '<b>Hello world? Hi there!!!!!</b>', // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

sendMail().catch(console.error);
