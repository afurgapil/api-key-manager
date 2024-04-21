const checkIndexExists = require("../utils/basicQueries/checkIndexExists");
const pool = require("../utils/settings/usePool");
exports.get_all = async function (req, res) {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: "Invalid parameter." });
    }
    const userExists = await checkIndexExists("user", userId);
    if (!userExists) {
      return res.status(400).json({ error: "User not found." });
    }
    const selectSql = `SELECT * FROM error_logs WHERE user_id = ? ORDER BY timestamp DESC`;

    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Database connection failed: " + getConnectionErr.message
        );
        return res.status(500).json({ error: "Database connection failed." });
      }

      connection.query(selectSql, [userId], (selectQueryErr, results) => {
        connection.release();

        if (selectQueryErr) {
          console.error(
            "Error retrieving error logs: " + selectQueryErr.message
          );
          return res
            .status(500)
            .json({ error: "Error retrieving error logs." });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: "No error logs found." });
        }
        return res.status(200).json({ data: results });
      });
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.delete = async function (req, res) {
  try {
    const { logId, userId } = req.body;
    const deleteSql = `DELETE FROM error_logs WHERE (id, user_id) = (?, ?)`;
    if (!logId || !userId) {
      return res.status(400).json({ error: "Invalid paramater." });
    }
    const isLogExists = await checkIndexExists("error_logs", logId);
    const isUserExists = await checkIndexExists("user", userId);
    if (!isLogExists) {
      return res.status(404).json({ error: "Log not found." });
    }
    if (!isUserExists) {
      return res.status(404).json({ error: "User not found." });
    }
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Database connection failed: " + getConnectionErr.message
        );
        return res.status(500).json({ error: "Database connection failed." });
      }

      connection.query(
        deleteSql,
        [logId, userId],
        (deleteQueryErr, results) => {
          connection.release();

          if (deleteQueryErr) {
            console.error(
              "Error deleting error logs: " + deleteQueryErr.message
            );
            return res
              .status(500)
              .json({ error: "Error deleting error logs." });
          }

          if (results.affectedRows === 0) {
            return res.status(404).json({
              error: "No error logs found for the specified path_id.",
            });
          }

          return res
            .status(200)
            .json({ message: "Error logs deleted successfully." });
        }
      );
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.deleteAll = async function (req, res) {
  try {
    const userId = req.params.userId;
    const deleteSql = `DELETE FROM error_logs WHERE user_id = ?`;
    if (!userId) {
      return res.status(400).json({ error: "Invalid parameter." });
    }
    const isUserExists = await checkIndexExists("user", userId);
    if (!isUserExists) {
      return res.status(404).json({ error: "User not found." });
    }
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Database connection failed: " + getConnectionErr.message
        );
        return res.status(500).json({ error: "Database connection failed." });
      }

      connection.query(deleteSql, [userId], (deleteQueryErr, results) => {
        connection.release();

        if (deleteQueryErr) {
          console.error("Error deleting error logs: " + deleteQueryErr.message);
          return res.status(500).json({ error: "Error deleting error logs." });
        }

        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ error: "No error logs found for the specified user." });
        }
        return res
          .status(200)
          .json({ message: "Error logs deleted successfully." });
      });
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};
