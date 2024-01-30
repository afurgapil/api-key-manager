const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");

const requestController = require("../controllers/requestController");
router.get("/:id", verifyToken, requestController.get);
module.exports = router;
