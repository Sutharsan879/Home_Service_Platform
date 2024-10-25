const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "YOUR_EMAIL@gmail.com", 
    pass: "YOUR_EMAIL_PASSWORD", 
  },
});

exports.sendEmailNotification = functions.https.onRequest((req, res) => {
  const { userEmail, subject, message } = req.body;

  const mailOptions = {
    from: "YOUR_EMAIL@gmail.com",
    to: userEmail,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send(error.toString());
    }
    console.log("Email sent:", info.response);
    return res.status(200).send("Email sent successfully");
  });
});
