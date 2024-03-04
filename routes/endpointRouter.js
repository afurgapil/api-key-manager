const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");

const endpointController = require("../controllers/endpointController");

router.post("/add", verifyToken, endpointController.add);

router.get("/get/:pathId", verifyToken, endpointController.get);

router.get("/get-all/:userId", verifyToken, endpointController.get_all);

router.get(
  "/get-usage/:userId/:timeInterval",
  verifyToken,
  endpointController.get_usage
);

router.post("/get-path-names", endpointController.get_path_names);

router.get(
  "/get-all-usages/:userId",
  verifyToken,
  endpointController.get_all_usage
);

router.put("/update/:pathId", verifyToken, endpointController.update);

router.delete("/delete/:pathId", verifyToken, endpointController.delete);
module.exports = router;
