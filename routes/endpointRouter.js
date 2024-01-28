const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");

const endpointController = require("../controllers/endpointController");
router.post("/add", verifyToken, endpointController.add);
router.get("/get", endpointController.get);
router.patch("/update/:pathId", verifyToken, endpointController.update);
router.delete("/delete/:pathId", verifyToken, endpointController.delete);
module.exports = router;
