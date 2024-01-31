const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const pool = require("../utils/settings/usePool");
const jwt = require("jsonwebtoken");
const generateUniqueId = require("../utils/generateUniqueId");
dotenv.config();

exports.signup = async function (req, res) {
  try {
    let id = await generateUniqueId();
    const { username, password, mail } = req.body;
    if (!username || !password || !mail) {
      return res.status(400).json({ error: "Invalid parameter." });
    }

    const registerSql =
      "INSERT INTO user (id, username, password, mail) VALUES (?, ?, ?, ?)";

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
            [id, username, hash, mail],
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
      "SELECT id, username, password, mail FROM user WHERE username = ?";

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
