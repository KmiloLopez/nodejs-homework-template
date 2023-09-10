const nodemailer = require("nodemailer");
require("dotenv").config();
const { EMAIL_SENDER, GENERATED_PASS } = process.env;

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_SENDER,
    pass: GENERATED_PASS,
  },
});

const emailService = {
  sendEmail(verificationToken) {
    mailTransporter.sendMail(
      {
        from: EMAIL_SENDER,
        to: "luckas_88@outlook.es",
        subject: "Authenticate your email",
        html: `<a href='http://localhost:3000/verify/${verificationToken}'>Verification email</a>`,
      },
      (err, data) => {
        if (err) {
          console.log(err);
          console.log("An error occurred");
        } else {
          console.log("Email sent successfully");
        }
      }
    );
  },
};

module.exports = emailService;
