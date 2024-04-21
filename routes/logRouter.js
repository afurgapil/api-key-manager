const router = require("express").Router();

const logController = require("../controllers/logController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/get-all/:userId", logController.get_all);

router.delete("/delete", verifyToken, logController.delete);

router.delete("/delete-all/:userId", verifyToken, logController.deleteAll);

module.exports = router;
