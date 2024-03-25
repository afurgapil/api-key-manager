const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");

const requestController = require("../controllers/requestController");

router.get("/test/:id", verifyToken, requestController.get);

router.get("/google-gemini/:pathId/:userId", requestController.googleGemini);

router.get("/openai-gpt/:pathId/:userId", requestController.openaigpt);

module.exports = router;
