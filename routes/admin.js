const { Router } = require("express");
const authenticate = require("../middlewares/check-auth");
const controller = require("../controllers/admin");
const router = Router();

router.post("/", authenticate, controller.create);
router.post("/login", controller.login);
router.post("/forgot", controller.forgotPassword);
router.post("/otp", controller.verifyOtp);
router.post("/reset", controller.resetPassword);

module.exports = router;
