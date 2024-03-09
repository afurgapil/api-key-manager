const router = require("express").Router();

const logController = require("../controllers/logController");

router.get("/get-all", logController.get_all);

router.delete("/delete/:logId", logController.delete);

router.delete("/delete-all", logController.deleteAll);

module.exports = router;
