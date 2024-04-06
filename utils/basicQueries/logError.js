//logTracker.js
const pool = require("../settings/usePool");
const checkIndexExists = require("../basicQueries/checkIndexExists");
module.exports = async function logError(userId, pathId, message) {
  return new Promise(async (resolve, reject) => {
    try {
      const exists = await checkIndexExists("user", userId);

      if (!exists) {
        reject(new Error("User not found"));
        return;
      }
      const updateSql =
        "INSERT INTO `error_logs` (`user_id`, `path_id`, `error_msg`) VALUES (?, ?, ?)";

      pool.getConnection((err, connection) => {
        if (err) {
          console.error("Database connection failed: " + err.message);
          reject(err);
          return;
        }

        connection.query(
          updateSql,
          [userId, pathId, message],
          (updateQueryErr, updateResults) => {
            if (updateQueryErr) {
              console.error(
                "Error updating user status: " + updateQueryErr.message
              );
              reject(updateQueryErr);
              return;
            }

            resolve({
              success: true,
              message: "Error log added successfully.",
            });

            connection.release();
          }
        );
      });
    } catch (error) {
      console.error("An unexpected error occurred: ", error);
      reject({
        success: false,
        message: "An unexpected error occurred: " + error.message,
      });
    }
  });
};
