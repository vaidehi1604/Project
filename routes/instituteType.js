const { Router } = require("express");
const controller = require("../controllers/instituteType");
const router = Router();

router.post("/", controller.addInstituteType);

module.exports = router;
