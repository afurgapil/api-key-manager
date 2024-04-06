const pool = require("../settings/usePool");
const checkIndexExists = require("./checkIndexExists");
module.exports = async function updateUser(userId, column, value) {
  return new Promise(async (resolve, reject) => {
    try {
      const exists = await checkIndexExists("user", userId);
      const updateSql = `UPDATE user SET ${column} = ? WHERE id = ?`;

      if (!exists) {
        reject(new Error("User not found"));
        return;
      }

      pool.getConnection((err, connection) => {
        if (err) {
          console.error("Database connection failed: " + err.message);
          reject(err);
          return;
        }

        connection.query(
          updateSql,
          [value, userId],
          (updateQueryErr, updateResults) => {
            if (updateQueryErr) {
              console.error(
                "Error updating user  status: " + updateQueryErr.message
              );
              reject(updateQueryErr);
              return;
            }

            resolve({
              success: true,
              message: "User value updated successfully.",
              column: value,
            });

            connection.release();
          }
        );
      });
    } catch (error) {
      console.error("An unexpected error occured: ", error);
      reject({
        success: false,
        message: "An unexpected error occured: " + error.message,
      });
    }
  });
};
