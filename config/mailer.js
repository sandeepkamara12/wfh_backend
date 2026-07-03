const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f617128d1092ed",  // Replace with your actual Mailtrap credentials
    pass: "394dd90de6a3f7"
  }
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: '"40 Days Challenge" <no-reply@40dayschallenge.com>',
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
