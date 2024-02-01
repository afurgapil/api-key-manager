const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const pool = require("../utils/settings/usePool");
const jwt = require("jsonwebtoken");
const generateUniqueId = require("../utils/generateUniqueId");
const generateCode = require("../utils/generateCode");
const updateVerification = require("../utils/basicQueries/updateVerification");
const updateUser = require("../utils/basicQueries/updateUser");
const useUser = require("../utils/basicQueries/useUser");
const resetMail = require("../mailOptions/resetMail");
const sendMail = require("../utils/sendMail");
const encrypt = require("../utils/encrypt");
const decrypt = require("../utils/decrypt");
const isValidToken = require("../utils/isValidToken");
dotenv.config();

exports.signup = async function (req, res) {
  try {
    let id = await generateUniqueId();
    let verificationCode = await generateCode();
    const { username, password, mail } = req.body;
    if (!username || !password || !mail) {
      return res.status(400).json({ error: "Invalid parameter." });
    }

    const registerSql =
      "INSERT INTO user (id, username, password, mail, verification_code, is_verificated) VALUES (?, ?, ?, ?, ?, ?)";

    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        console.error("Error generating salt: " + err.message);
        return res.status(500).json({ error: "Error generating salt." });
      }

      bcrypt.hash(password, salt, function (hashErr, hash) {
        if (hashErr) {
          console.error("Hashing error: " + hashErr.message);
          return res.status(500).json({ error: "Hashing error." });
        }

        pool.getConnection(function (getConnectionErr, connection) {
          if (getConnectionErr) {
            console.error(
              "Database connection failed: " + getConnectionErr.message
            );
            return res
              .status(500)
              .json({ error: "Database connection failed." });
          }

          connection.query(
            registerSql,
            [id, username, hash, mail, verificationCode, 0],
            function (registerQueryErr) {
              if (registerQueryErr) {
                connection.release();
                console.error(
                  "Error during registration: " + registerQueryErr.message
                );
                return res
                  .status(500)
                  .json({ error: "Error during registration." });
              } else {
                connection.release();
                return res.status(201).json({
                  message: "Success",
                  data: { id, username, mail },
                });
              }
            }
          );
        });
      });
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.signin = async function (req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Invalid parameter." });
    }

    const getUserSql =
      "SELECT id, username, password, mail, is_verificated FROM user WHERE username = ?";

    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Database connection failed: " + getConnectionErr.message
        );
        return res.status(500).json({ error: "Database connection failed." });
      }

      connection.query(getUserSql, [username], (getUserErr, getUserRes) => {
        if (getUserErr) {
          connection.release();
          console.error(
            "Unable to retrieve user information: " + getUserErr.message
          );
          return res
            .status(500)
            .json({ error: "Unable to retrieve user information." });
        }

        if (getUserRes.length === 0) {
          connection.release();
          return res.status(401).json({ error: "User not found." });
        }

        const user = getUserRes[0];
        if (user.is_verificated == 0) {
          return res
            .status(401)
            .json({ error: "Please verificate your mail." });
        }
        bcrypt.compare(password, user.password, (bcryptErr, result) => {
          if (bcryptErr) {
            connection.release();
            console.error("Password comparison error: " + bcryptErr.message);
            return res
              .status(500)
              .json({ error: "Password comparison error." });
          }

          if (result) {
            const token = jwt.sign(
              { userId: user.id, username: user.username },
              process.env.SECRET_KEY,
              { expiresIn: "8h" }
            );

            connection.release();
            return res.status(200).json({
              message: "Success",
              user: {
                id: user.id,
                username: user.username,
                mail: user.mail,
              },
              token: token,
            });
          } else {
            connection.release();
            return res.status(401).json({ error: "Incorrect password." });
          }
        });
      });
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.verify = async function (req, res) {
  const userId = req.params.id;
  const { verificationCode } = req.body;
  if (!userId || !verificationCode) {
    return res.status(400).json({ error: "Invalid parameter." });
  }

  try {
    const data = await useUser("id", userId);

    if (!data) {
      return res.status(404).json({ error: "User not found." });
    }
    if (data.verification_code == verificationCode) {
      await updateVerification(userId, 1);
      return res
        .status(200)
        .json({ message: "Account successfully verified." });
    } else {
      return res.status(401).json({ error: "Invalid verification code." });
    }
  } catch (error) {
    console.error("An unexpected error occurred. " + error.message);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

exports.resetPasswordRequest = async function (req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Invalid request body." });
    }
    try {
      const user = await useUser("mail", email);
      if (user) {
        const updateResult = await updateVerification(user.id, 0);
        if (updateResult.success) {
          const encodedMail = encrypt(user.mail + process.env.MAIL_SECRET_KEY);
          try {
            const mailOptions = resetMail(
              email,
              encodedMail,
              updateResult.code
            );
            await sendMail(mailOptions);
            res.status(200).json({
              message: "Reset password instructions sent to your email.",
            });
          } catch (error) {
            res.status(404).json({
              message: error,
            });
          }
        } else {
          res
            .status(500)
            .json({ message: "Error updating verification code and status." });
        }
      } else {
        res.status(404).json({ message: "User not found." });
      }
    } catch (error) {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("An unexpected error occurred: " + error.message);
    res.status(500).json({ error: "Error resetting the password." });
  }
};

exports.resetPasswordCheck = async function (req, res) {
  try {
    const encodedMail = req.params.mail;
    const { token, newPassword } = req.body;
    if (!encodedMail || !token || !newPassword) {
      return res.status(400).json({ error: "Invalid parameter." });
    }
    const decodedMail = decrypt(process.env.MAIL_SECRET_KEY, encodedMail);
    if (!isValidToken(decodedMail, token)) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        console.error("Error generating salt: " + err.message);
        return res.status(500).json({ error: "Error generating salt." });
      }

      bcrypt.hash(newPassword, salt, async function (hashErr, hash) {
        if (hashErr) {
          console.error("Hashing error: " + hashErr.message);
          return res.status(500).json({ error: "Hashing error." });
        }

        const user = await useUser("mail", decodedMail);
        await updateUser(user.id, "password", hash);
        await updateVerification(user.id, 1);
        return res
          .status(200)
          .json({ message: "Password reset successfully." });
      });
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};
