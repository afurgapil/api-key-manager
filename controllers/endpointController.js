const pool = require("../utils/settings/usePool");
const generateUniqueId = require("../utils/generateUniqueId");
exports.add = async function (req, res) {
  try {
    const { userId, url, key } = req.body;
    let id = await generateUniqueId();
    const insertSql =
      "INSERT INTO `path` (`id`, `user_id`, `url`, `key`) VALUES (?, ?, ?, ?)";

    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Database connection failed: " + getConnectionErr.message
        );
        return res.status(500).json({ error: "Database connection failed." });
      }

      connection.query(insertSql, [id, userId, url, key], (insertQueryErr) => {
        if (insertQueryErr) {
          connection.release();
          console.error("Error creating path: " + insertQueryErr.message);
          return res.status(500).json({ error: "Error creating path." });
        }

        connection.release();
        return res.status(201).json({
          message: "Path created.",
          data: { id, userId, url, key },
        });
      });
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.get = async function (req, res) {
  try {
    const pathId = req.params.id;
    const selectSql = "SELECT * FROM `path` WHERE `id` = ?";

    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Database connection failed: " + getConnectionErr.message
        );
        return res.status(500).json({ error: "Database connection failed." });
      }

      connection.query(selectSql, [pathId], (selectQueryErr, results) => {
        if (selectQueryErr) {
          connection.release();
          console.error("Error retrieving path: " + selectQueryErr.message);
          return res.status(500).json({ error: "Error retrieving path." });
        }

        if (results.length === 0) {
          connection.release();
          return res.status(404).json({ error: "Path not found." });
        }

        const pathData = results[0];
        connection.release();
        return res.status(200).json({ data: pathData });
      });
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.get_all = async function (req, res) {
  try {
    const userId = req.params.userId;
    const selectSql = "SELECT * FROM `path` WHERE `user_id` = ?";

    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Database connection failed: " + getConnectionErr.message
        );
        return res.status(500).json({ error: "Database connection failed." });
      }

      connection.query(selectSql, [userId], (selectQueryErr, results) => {
        if (selectQueryErr) {
          connection.release();
          console.error("Error retrieving path: " + selectQueryErr.message);
          return res.status(500).json({ error: "Error retrieving path." });
        }

        if (results.length === 0) {
          connection.release();
          return res.status(404).json({ error: "Path not found." });
        }

        connection.release();
        return res.status(200).json({ data: results });
      });
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.update = async function (req, res) {
  try {
    const pathId = req.params.pathId;
    const { userId, url, key } = req.body;
    const updateSql =
      "UPDATE `path` SET `user_id` = ?, `url` = ?, `key` = ? WHERE `id` = ?";
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Database connection failed: " + getConnectionErr.message
        );
        return res.status(500).json({ error: "Database connection failed." });
      }

      connection.query(
        updateSql,
        [userId, url, key, pathId],
        (updateQueryErr) => {
          if (updateQueryErr) {
            connection.release();
            console.error("Error updating path: " + updateQueryErr.message);
            return res.status(500).json({ error: "Error updating path." });
          }
          connection.release();
          return res.status(200).json({ message: "Path updated." });
        }
      );
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.delete = async function (req, res) {
  try {
    const pathId = req.params.pathId;
    const deleteSql = "DELETE FROM `path` WHERE `id` = ?";

    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Database connection failed: " + getConnectionErr.message
        );
        return res.status(500).json({ error: "Database connection failed." });
      }

      connection.query(deleteSql, [pathId], (deleteQueryErr) => {
        if (deleteQueryErr) {
          connection.release();
          console.error("Error deleting path: " + deleteQueryErr.message);
          return res.status(500).json({ error: "Error deleting path." });
        }

        connection.release();
        return res.status(200).json({ message: "Path deleted." });
      });
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};
