const pool = require("../settings/usePool");

module.exports = function checkIndexExists(tableName, index) {
  return new Promise((resolve, reject) => {
    const selectSql = `SELECT id FROM ${tableName} WHERE id = ?`;

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Veritabanı bağlantısı kurulamadı: " + err.message);
        reject(err);
        return;
      }
      connection.query(selectSql, [index], (queryErr, results) => {
        if (queryErr) {
          console.error(
            "Kayıt sorgulanırken bir hata oluştu: " + queryErr.message
          );

          reject(queryErr);
          return;
        }
        if (results.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
        connection.release();
      });
    });
  });
};
