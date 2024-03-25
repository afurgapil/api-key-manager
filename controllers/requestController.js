const { GoogleGenerativeAI } = require("@google/generative-ai");
const usePath = require("../utils/usePath");
const decrypt = require("../utils/decrypt");
const testReq = require("../utils/testReq");
const usageTracker = require("../utils/basicQueries/usageTracker");
const logTracker = require("../utils/basicQueries/logError");
const CryptoJS = require("crypto-js");
const useKey = require("../utils/basicQueries/useKey");
const OpenAI = require("openai");

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
exports.googleGemini = async function (req, res) {
  const { prompt } = req.body;
  const { pathId, userId } = req.params;
  let apiKey, privateKey, modelType;
  try {
    const data = await useKey(pathId, userId);
    if (data) {
      apiKey = data.api_key;
      privateKey = data.key;
      modelType = data.type;
    }
    const bytes = CryptoJS.AES.decrypt(prompt, privateKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelType });
    const result = await model.generateContent(plaintext);
    const response = await result.response;
    const text = response.text();
    res.send(text);
  } catch (error) {
    console.error("Error on generating:", error);
    res.status(404).send("Error on generating.");
  }
};
exports.openaigpt = async function (req, res) {
  const { prompt, role } = req.body;
  const { pathId, userId } = req.params;
  let apiKey, privateKey, modelType;
  try {
    const data = await useKey(pathId, userId);
    if (data) {
      apiKey = data.api_key;
      privateKey = data.key;
      modelType = data.type;
    }
    const bytes = CryptoJS.AES.decrypt(prompt, privateKey);
    const decodedPrompt = bytes.toString(CryptoJS.enc.Utf8);
    console.log(apiKey);
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });
    const params = {
      messages: [{ role: role, content: decodedPrompt }],
      model: modelType,
    };

    const chatCompletion = await openai.chat.completions.create(params);
    res.send(chatCompletion);
  } catch (error) {
    console.error("Error on generating:", error);
    res.status(404).send("Error on generating.");
  }
};
