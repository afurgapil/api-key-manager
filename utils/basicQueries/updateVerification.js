const pool = require("../settings/usePool");
const checkIndexExists = require("./checkIndexExists");
const generateCode = require("../generateCode");
module.exports = async function updateVerification(userId, status) {
  return new Promise(async (resolve, reject) => {
    try {
      let verificationCode = await generateCode();
      const exists = await checkIndexExists("user", userId);
      const updateSql =
        "UPDATE user SET verification_code = ?, is_verificated = ? WHERE id = ?";

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
          [verificationCode, status, userId],
          (updateQueryErr, updateResults) => {
            if (updateQueryErr) {
              console.error(
                "Error updating user verification status: " +
                  updateQueryErr.message
              );
              reject(updateQueryErr);
              return;
            }

            resolve({
              success: true,
              message: "User verification status updated successfully.",
              code: verificationCode,
            });

            connection.release();
          }
        );
      });
    } catch (error) {
      console.error("An unexpected error occured: ", error);
      reject({
        success: false,
        message: "An unexpected error occured: ",
      });
    }
  });
};
