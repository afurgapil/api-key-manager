const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");

const endpointController = require("../controllers/endpointController");

router.post("/add", verifyToken, endpointController.add);

router.get("/get/:pathId", verifyToken, endpointController.get);

router.get("/get-all/:userId", verifyToken, endpointController.get_all);

router.put("/update/:pathId", verifyToken, endpointController.update);

router.delete("/delete/:pathId", verifyToken, endpointController.delete);
module.exports = router;
