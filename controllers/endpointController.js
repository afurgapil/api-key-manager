const pool = require("../utils/settings/usePool");
const generateUniqueId = require("../utils/generateUniqueId");
exports.add = async function (req, res) {
  try {
    const { userId, url, key } = req.body;
    let id = await generateUniqueId();
    const insertSql =
      "INSERT INTO `path` (`id`, `user_id`, `url`, `key`) VALUES (?, ?, ?, ?)";

    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Veritabanı bağlantısı kurulamadı: " + getConnectionErr.message
        );
        return res
          .status(500)
          .json({ error: "Veritabanı bağlantısı kurulamadı." });
      }

      connection.query(insertSql, [id, userId, url, key], (insertQueryErr) => {
        if (insertQueryErr) {
          connection.release();
          console.error(
            "Path oluşturulurken hata oluştu: " + insertQueryErr.message
          );
          return res
            .status(500)
            .json({ error: "Path oluşturulurken hata oluştu." });
        }

        connection.release();
        return res.status(201).json({
          message: "Path oluşturuldu.",
          data: { id, userId, url, key },
        });
      });
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};
exports.get = async function (req, res) {
  try {
    const pathId = req.params.id;
    const selectSql = "SELECT * FROM `path` WHERE `id` = ?";

    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Veritabanı bağlantısı kurulamadı: " + getConnectionErr.message
        );
        return res
          .status(500)
          .json({ error: "Veritabanı bağlantısı kurulamadı." });
      }

      connection.query(selectSql, [pathId], (selectQueryErr, results) => {
        if (selectQueryErr) {
          connection.release();
          console.error(
            "Path getirilirken hata oluştu: " + selectQueryErr.message
          );
          return res
            .status(500)
            .json({ error: "Path getirilirken hata oluştu." });
        }

        if (results.length === 0) {
          connection.release();
          return res.status(404).json({ error: "Path bulunamadı." });
        }

        const pathData = results[0];
        connection.release();
        return res.status(200).json({ data: pathData });
      });
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};
exports.update = async function (req, res) {
  try {
    const pathId = req.params.pathId;
    const { userId, url, key } = req.body;
    const updateSql =
      "UPDATE `path` SET `user_id` = ?, `url` = ?, `key` = ? WHERE `id` = ?";
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Veritabanı bağlantısı kurulamadı: " + getConnectionErr.message
        );
        return res
          .status(500)
          .json({ error: "Veritabanı bağlantısı kurulamadı." });
      }

      connection.query(
        updateSql,
        [userId, url, key, pathId],
        (updateQueryErr) => {
          if (updateQueryErr) {
            connection.release();
            console.error(
              "Path güncellenirken hata oluştu: " + updateQueryErr.message
            );
            return res
              .status(500)
              .json({ error: "Path güncellenirken hata oluştu." });
          }
          connection.release();
          return res.status(200).json({ message: "Path güncellendi." });
        }
      );
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};
exports.delete = async function (req, res) {
  try {
    const pathId = req.params.pathId;
    const deleteSql = "DELETE FROM `path` WHERE `id` = ?";

    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Veritabanı bağlantısı kurulamadı: " + getConnectionErr.message
        );
        return res
          .status(500)
          .json({ error: "Veritabanı bağlantısı kurulamadı." });
      }

      connection.query(deleteSql, [pathId], (deleteQueryErr) => {
        if (deleteQueryErr) {
          connection.release();
          console.error(
            "Path silinirken hata oluştu: " + deleteQueryErr.message
          );
          return res
            .status(500)
            .json({ error: "Path silinirken hata oluştu." });
        }

        connection.release();
        return res.status(200).json({ message: "Path silindi." });
      });
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};
