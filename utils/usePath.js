const pool = require("./settings/usePool");

module.exports = function usePath(id) {
  return new Promise((resolve, reject) => {
    const userId = id;
    const selectSql = "SELECT url, `key` FROM path WHERE id=?";

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Veritabanı bağlantısı kurulamadı: " + err.message);

        reject(err);
        return;
      }

      connection.query(selectSql, [userId], (queryErr, results) => {
        if (queryErr) {
          connection.release();
          console.error(
            "Kullanıcı sorgulanırken hata oluştu: " + queryErr.message
          );

          reject(queryErr);
          return;
        }

        if (results.length === 0) {
          connection.release();
          reject(new Error("Kullanıcı bulunamadı"));
          return;
        }
        connection.release();
        const path = results[0];
        resolve(path);
      });
    });
  });
};
