const nodemailer = require('nodemailer');


function mailer(sub, msg, emails) {

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'abtiwari2904@gmail.com',
      pass: 'fdlnfgfdxpbzxbml'
    }
  });
  

  const mailOptions = {
    from: 'abtiwari2904@gmail.com',
    to: emails,
    subject: sub,
    text: 'This is the plain text version of the email.',
    html: msg
  };
  

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  }); 
}


module.exports = mailer

