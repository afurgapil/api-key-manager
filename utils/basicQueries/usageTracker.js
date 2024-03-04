const pool = require("../settings/usePool");

module.exports = async function usageTracker(userId, pathId) {
  return new Promise(async (resolve, reject) => {
    const insertSql = "INSERT INTO api_usage (user_id, path_id) VALUES (?, ?)";
    try {
      pool.getConnection((err, connection) => {
        if (err) {
          console.error("Database connection failed: " + err.message);
          reject(err);
          return;
        }
        connection.query(insertSql, [userId, pathId], (queryErr, results) => {
          if (queryErr) {
            console.error(
              "An error occurred while querying the record: " + queryErr.message
            );

            reject(queryErr);
            return;
          }
          resolve(true);
          connection.release();
        });
      });
      console.log("API usage tracked successfully.");
    } catch (error) {
      console.error("Error tracking API usage:", error);
    }
  });
};
