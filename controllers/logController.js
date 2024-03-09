const pool = require("../utils/settings/usePool");
exports.get_all = async function (req, res) {
  try {
    const selectSql = `SELECT * FROM error_logs ORDER BY timestamp DESC;`;
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Database connection failed: " + getConnectionErr.message
        );
        return res.status(500).json({ error: "Database connection failed." });
      }

      connection.query(selectSql, (selectQueryErr, results) => {
        connection.release();

        if (selectQueryErr) {
          console.error(
            "Error retrieving error logs: " + selectQueryErr.message
          );
          return res
            .status(500)
            .json({ error: "Error retrieving error logs." });
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
    const logId = req.params.logId;
    const deleteSql = `DELETE FROM error_logs WHERE id = ?`;

    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Database connection failed: " + getConnectionErr.message
        );
        return res.status(500).json({ error: "Database connection failed." });
      }

      connection.query(deleteSql, [logId], (deleteQueryErr, results) => {
        connection.release();

        if (deleteQueryErr) {
          console.error("Error deleting error logs: " + deleteQueryErr.message);
          return res.status(500).json({ error: "Error deleting error logs." });
        }

        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ error: "No error logs found for the specified path_id." });
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

exports.deleteAll = async function (req, res) {
  try {
    const deleteSql = `DELETE FROM error_logs`;

    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Database connection failed: " + getConnectionErr.message
        );
        return res.status(500).json({ error: "Database connection failed." });
      }

      connection.query(deleteSql, (deleteQueryErr, results) => {
        connection.release();

        if (deleteQueryErr) {
          console.error("Error deleting error logs: " + deleteQueryErr.message);
          return res.status(500).json({ error: "Error deleting error logs." });
        }

        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ error: "No error logs found for the specified path_id." });
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
