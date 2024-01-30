const usePath = require("../utils/usePath");
const decrypt = require("../utils/decrypt");
const testReq = require("../utils/testReq");
exports.get = async function (req, res) {
  try {
    const { userId, pathId, prompt } = req.body;
    console.log("userid :", userId);
    console.log("pathId :", pathId);
    console.log("prompt :", prompt);
    const pathInfo = await usePath(pathId);
    if (!pathInfo) {
      return res.status(404).json({ error: "Belirtilen path bulunamadı." });
    }
    console.log(pathInfo);
    const result = decrypt(pathInfo.key, prompt);
    console.log("decoded :", result);
    const response = await testReq(pathInfo.url, result);
    res.status(200).json({ data: response });
  } catch (error) {
    console.error("An error occurred. " + error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};
