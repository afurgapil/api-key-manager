const router = require("express").Router();

const contactRouterController = require("../controllers/contactController");

router.post("/send-mail", contactRouterController.sendMail);

module.exports = router;
