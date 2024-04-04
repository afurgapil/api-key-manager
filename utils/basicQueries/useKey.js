const pool = require("../settings/usePool");

module.exports = function getKey(pathId, userId) {
  return new Promise((resolve, reject) => {
    const selectSql = `SELECT * FROM path WHERE id  = ? AND user_id = ?`;
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Database connection failed: " + err.message);
        reject(err);
        return;
      }

      connection.query(selectSql, [pathId, userId], (queryErr, results) => {
        if (queryErr) {
          connection.release();
          console.error(
            "Unable to retrieve path information: " + queryErr.message
          );
          reject(queryErr);
          return;
        }
        if (results.length === 0) {
          connection.release();
          reject(new Error("User key not found."));
          return;
        }

        connection.release();
        const data = results[0];
        resolve(data);
      });
    });
  });
};
