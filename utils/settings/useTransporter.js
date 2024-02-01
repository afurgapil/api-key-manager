const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
module.exports = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});
