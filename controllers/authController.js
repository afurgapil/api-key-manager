const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const pool = require("../utils/settings/usePool");
const checkIndexExists = require("../utils/basicQueries/checkIndexExists");
const jwt = require("jsonwebtoken");
const generateUniqueId = require("../utils/generateUniqueId");
dotenv.config();

exports.signup = async function (req, res) {
  try {
    let id = await generateUniqueId();
    console.log(id);
    const { username, password, mail } = req.body;
    if (!username || !password || !mail) {
      return res.status(400).json({ error: "Geçersiz parametre." });
    }

    const registerSql =
      "INSERT INTO user (id, username, password, mail) VALUES (?, ?, ?, ?)";

    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        console.error("Salt üretilirken hata oluştu: " + err.message);
        return res.status(500).json({ error: "Salt üretilirken hata oluştu." });
      }

      bcrypt.hash(password, salt, function (hashErr, hash) {
        if (hashErr) {
          console.error("Şifreleme hatası: " + hashErr.message);
          return res.status(500).json({ error: "Şifreleme hatası." });
        }

        pool.getConnection(function (getConnectionErr, connection) {
          if (getConnectionErr) {
            console.error(
              "Veritabanı bağlantısı kurulamadı: " + getConnectionErr.message
            );
            return res
              .status(500)
              .json({ error: "Veritabanı bağlantısı kurulamadı." });
          }

          connection.query(
            registerSql,
            [id, username, hash, mail],
            function (registerQueryErr) {
              if (registerQueryErr) {
                connection.release();
                console.error(
                  "Kayıt sırasında hata oluştu: " + registerQueryErr.message
                );
                return res
                  .status(500)
                  .json({ error: "Kayıt sırasında hata oluştu." });
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
      return res.status(400).json({ error: "Geçersiz parametre." });
    }

    const getUserSql =
      "SELECT id, username, password, mail FROM user WHERE username = ?";

    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Veritabanı bağlantısı kurulamadı: " + getConnectionErr.message
        );
        return res
          .status(500)
          .json({ error: "Veritabanı bağlantısı kurulamadı." });
      }

      connection.query(getUserSql, [username], (getUserErr, getUserRes) => {
        if (getUserErr) {
          connection.release();
          console.error("Kullanıcı bilgileri alınamadı: " + getUserErr.message);
          return res
            .status(500)
            .json({ error: "Kullanıcı bilgileri alınamadı." });
        }

        if (getUserRes.length === 0) {
          connection.release();
          return res.status(401).json({ error: "Kullanıcı bulunamadı." });
        }

        const user = getUserRes[0];
        bcrypt.compare(password, user.password, (bcryptErr, result) => {
          if (bcryptErr) {
            connection.release();
            console.error("Şifre karşılaştırma hatası: " + bcryptErr.message);
            return res
              .status(500)
              .json({ error: "Şifre karşılaştırma hatası." });
          }

          if (result) {
            const token = jwt.sign(
              { userId: user.id, username: user.username },
              process.env.SECRET_KEY,
              { expiresIn: "1h" }
            );

            connection.release();
            return res.status(200).json({
              message: "Success",
              data: {
                id: user.id,
                username: user.username,
                mail: user.mail,
                token,
              },
            });
          } else {
            connection.release();
            return res.status(401).json({ error: "Hatalı şifre." });
          }
        });
      });
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};
