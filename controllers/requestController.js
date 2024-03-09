const usePath = require("../utils/usePath");
const decrypt = require("../utils/decrypt");
const testReq = require("../utils/testReq");
const usageTracker = require("../utils/basicQueries/usageTracker");
const logTracker = require("../utils/basicQueries/logError");

exports.get = async function (req, res) {
  let userId, pathId;

  try {
    ({ userId, pathId, prompt } = req.body);
    const pathInfo = await usePath(pathId);

    if (!pathInfo) {
      return res.status(404).json({ error: "Specified path not found." });
    }

    const result = decrypt(pathInfo.key, prompt);
    await usageTracker(userId, pathId);
    const response = await testReq(pathInfo.url, result);
    console.log("res", response);

    res.status(200).json({ data: response });
  } catch (error) {
    console.log("tetik");
    const log = await logTracker(userId, pathId, error.message);
    console.log(log);
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};
