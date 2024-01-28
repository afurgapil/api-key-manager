const router = require("express").Router();

const authRouterController = require("../controllers/authController");

router.post("/signup", authRouterController.signup);

router.post("/signin", authRouterController.signin);

module.exports = router;
