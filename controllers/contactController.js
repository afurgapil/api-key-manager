const dotenv = require("dotenv");
const sendMail = require("../utils/sendMail");
const infoMail = require("../mailOptions/infoMail");
dotenv.config();

exports.sendMail = async function (req, res) {
  try {
    const { name, lastname, email, message } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Invalid request body." });
    }
    try {
      const mailOptions = infoMail(name, lastname, email, message);
      await sendMail(mailOptions);
      res.status(200).json({
        message: "User message saved successfully.",
      });
    } catch (error) {
      res.status(404).json({
        message: error,
      });
    }
  } catch (error) {
    console.error("An unexpected error occurred: " + error.message);
    res.status(500).json({ error: "Error saving the user message." });
  }
};
