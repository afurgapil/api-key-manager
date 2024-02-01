const pool = require("../settings/usePool");

module.exports = function getUser(type, value) {
  return new Promise((resolve, reject) => {
    const selectSql = `SELECT * FROM user WHERE ${type} = ?`;

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Database connection failed: " + err.message);
        reject(err);
        return;
      }

      connection.query(selectSql, [value], (queryErr, results) => {
        if (queryErr) {
          connection.release();
          console.error(
            "Unable to retrieve user information: " + queryErr.message
          );
          reject(queryErr);
          return;
        }

        if (results.length === 0) {
          connection.release();
          reject(new Error("User not found."));
          return;
        }
        connection.release();
        const user = results[0];
        resolve(user);
      });
    });
  });
};
