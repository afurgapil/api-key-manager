const pool = require("../utils/settings/usePool");
const generateUniqueId = require("../utils/generateUniqueId");
exports.add = async function (req, res) {
  try {
    const { userId, url, api_key, key, company, type, price } = req.body;
    let id = await generateUniqueId();
    const insertSql =
      "INSERT INTO `path` (`id`, `user_id`, `url`, `api_key`, `key`, `company`, `type`, `price`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Database connection failed: " + getConnectionErr.message
        );
        return res.status(500).json({ error: "Database connection failed." });
      }

      connection.query(
        insertSql,
        [id, userId, url, api_key, key, company, type, price],
        (insertQueryErr) => {
          if (insertQueryErr) {
            connection.release();
            console.error("Error creating path: " + insertQueryErr.message);
            return res.status(500).json({ error: "Error creating path." });
          }

          connection.release();
          return res.status(201).json({
            message: "Path created.",
            data: { id },
          });
        }
      );
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

exports.get_usage = async function (req, res) {
  try {
    const userId = req.params.userId;
    const timeInterval = req.params.timeInterval;
    let selectSql = ``;
    switch (timeInterval) {
      case "all":
        selectSql = `
          SELECT path_id, COUNT(*) as usage_count, GROUP_CONCAT(timestamp ORDER BY timestamp SEPARATOR ',') AS timestamps
          FROM api_usage
          WHERE user_id = ?
          GROUP BY path_id
        `;
        break;

      case "1":
        selectSql = `
          SELECT path_id, COUNT(*) as usage_count, GROUP_CONCAT(timestamp ORDER BY timestamp SEPARATOR ',') AS timestamps
          FROM api_usage
          WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
          GROUP BY path_id
        `;
        break;

      case "3":
        selectSql = `
          SELECT path_id, COUNT(*) as usage_count, GROUP_CONCAT(timestamp ORDER BY timestamp SEPARATOR ',') AS timestamps
          FROM api_usage
          WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
          GROUP BY path_id
        `;
        break;

      case "6":
        selectSql = `
          SELECT path_id, COUNT(*) as usage_count, GROUP_CONCAT(timestamp ORDER BY timestamp SEPARATOR ',') AS timestamps
          FROM api_usage
          WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
          GROUP BY path_id
        `;
        break;

      case "12":
        selectSql = `
          SELECT path_id, COUNT(*) as usage_count, GROUP_CONCAT(timestamp ORDER BY timestamp SEPARATOR ',') AS timestamps
          FROM api_usage
          WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
          GROUP BY path_id
        `;
        break;

      default:
        return res
          .status(400)
          .json({ error: "Invalid timeInterval parameter." });
    }
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
          return res.status(204).json({ error: "Usage not found." });
        }
        connection.release();
        return res.status(200).json(results);
      });
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.get_prices = async function (req, res) {
  try {
    const userId = req.params.userId;
    const selectSql = `
          SELECT path_id, COUNT(*) as usage_count, GROUP_CONCAT(timestamp ORDER BY timestamp SEPARATOR ',') AS timestamps
          FROM api_usage
          WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
          GROUP BY path_id
        `;

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
          return res.status(204).json({ error: "Usage not found." });
        }
        connection.release();
        return res.status(200).json(results);
      });
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.get_all_usage = async function (req, res) {
  try {
    const userId = req.params.userId;
    const selectSql = "SELECT SUM(`usage`) FROM `path` WHERE `user_id` = ?";
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
        return res.status(200).json({ data: results[0] });
      });
    });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.get_path_names = async function (req, res) {
  try {
    const names = [];
    const pathIds = req.body.pathIds;
    const selectSql = `SELECT company, type FROM path WHERE id = ?`;

    for (const pathId of pathIds) {
      const connection = await new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
          if (err) {
            console.error("Database connection failed: " + err.message);
            reject({ error: "Database connection failed." });
          }
          resolve(conn);
        });
      });

      try {
        const results = await new Promise((resolve, reject) => {
          connection.query(selectSql, [pathId], (err, results) => {
            if (err) {
              connection.release();
              console.error("Error retrieving paths: " + err.message);
              reject({ error: "Error retrieving paths." });
            }
            resolve(results);
          });
        });

        if (results.length === 0) {
          connection.release();
          return res.status(404).json({ error: "Paths not found." });
        }

        const objectArray = results.map((row) => ({
          company: row.company,
          type: row.type,
        }));
        const newArray = objectArray.map((item) => [item.company, item.type]);
        names.push(newArray);
        connection.release();
      } catch (err) {
        connection.release();
        return res.status(500).json(err);
      }
    }

    return res.status(200).json({ data: names });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.update = async function (req, res) {
  try {
    const pathId = req.params.pathId;
    const { userId, url, api_key, key, price } = req.body;
    const updateSql =
      "UPDATE `path` SET `user_id` = ?, `url` = ?, `api_key` = ?, `key` = ?, `price` = ? WHERE `id` = ?";
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        console.error(
          "Database connection failed: " + getConnectionErr.message
        );
        return res.status(500).json({ error: "Database connection failed." });
      }

      connection.query(
        updateSql,
        [userId, url, api_key, key, price, pathId],
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
