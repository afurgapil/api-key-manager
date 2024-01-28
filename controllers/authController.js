const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const pool = require("../utils/settings/usePool");
const checkIndexExists = require("../utils/basicQueries/checkIndexExists");
const { v4: uuidv4 } = require("uuid");
dotenv.config();
const secretKey = process.env.SECRET_KEY;

exports.signup = async function (req, res) {
  try {
    let id = uuidv4();
    const { username, password, mail } = req.body;
    console.log(id, username, password, mail);
    if (!username || !password || !mail) {
      return res.status(400).json({ error: "Geçersiz parametre." });
    }
    while (await checkIndexExists("user", id)) {
      id = uuidv4();
      console.log(id);
    }
    const registerSql =
      "INSERT INTO user (id, username, password, mail) VALUES (?, ?, ?, ?)";

    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Veritabanı bağlantısı kurulamadı: " + getConnectionErr.message
        );
        return res
          .status(500)
          .json({ error: "Veritabanı bağlantısı kurulamadı." });
      }

      connection.beginTransaction((beginTransactionErr) => {
        if (beginTransactionErr) {
          connection.release();
          console.error(
            "Transaction başlatılamadı: " + beginTransactionErr.message
          );
          return res.status(500).json({ error: "Transaction başlatılamadı." });
        }

        bcrypt.genSalt(10, (genSaltErr, salt) => {
          if (genSaltErr) {
            connection.rollback(() => {
              connection.release();
              console.error(
                "Salt üretilirken hata oluştu: " + genSaltErr.message
              );
              return res
                .status(500)
                .json({ error: "Salt üretilirken hata oluştu." });
            });
          }

          bcrypt.hash(password, salt, (hashErr, hash) => {
            console.log(salt);
            if (hashErr) {
              connection.rollback(() => {
                connection.release();
                console.error("Şifreleme hatası: " + hashErr.message);
                return res.status(500).json({ error: "Şifreleme hatası." });
              });
            }

            connection.query(
              registerSql,
              [id, username, hash, mail],
              (registerQueryErr) => {
                if (registerQueryErr) {
                  connection.rollback(() => {
                    connection.release();
                    console.error(
                      "Kayıt sırasında hata oluştu: " + registerQueryErr.message
                    );
                    return res
                      .status(500)
                      .json({ error: "Kayıt sırasında hata oluştu." });
                  });
                } else {
                  connection.commit((commitErr) => {
                    if (commitErr) {
                      connection.rollback(() => {
                        connection.release();
                        console.error(
                          "Transaction commit hatası: " + commitErr.message
                        );
                        return res
                          .status(500)
                          .json({ error: "Transaction commit hatası." });
                      });
                    } else {
                      connection.release();
                      return res.status(201).json({
                        message: "Success",
                        data: { id, username, mail },
                      });
                    }
                  });
                }
              }
            );
          });
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

        bcrypt.compare(password, user.password, (compareErr, match) => {
          console.log(password);
          console.log(user.password);
          if (compareErr) {
            connection.release();
            console.error("Şifre karşılaştırma hatası: " + compareErr.message);
            return res
              .status(500)
              .json({ error: "Şifre karşılaştırma hatası." });
          }
          console.log(match);
          if (!match) {
            connection.release();
            return res.status(200).json({
              message: "Success",
              data: { id: user.id, username: user.username, mail: user.mail },
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
