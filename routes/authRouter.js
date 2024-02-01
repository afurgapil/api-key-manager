const router = require("express").Router();

const authRouterController = require("../controllers/authController");

router.post("/signup", authRouterController.signup);

router.post("/signin", authRouterController.signin);

router.patch("/reset/request", authRouterController.resetPasswordRequest);

router.patch("/reset/check/:mail", authRouterController.resetPasswordCheck);

router.patch("/verify/:id", authRouterController.verify);

module.exports = router;
