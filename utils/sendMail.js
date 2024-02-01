const useTransporter = require("./settings/useTransporter");

const transporter = useTransporter;

module.exports = function sendVerificationEmail(mailOptions) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        reject(error);
      } else {
        console.log("Email was sent successfully:", info.response);
        resolve(info);
      }
    });
  });
};
