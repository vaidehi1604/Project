const { Router } = require("express");
const controller = require("../controllers/instituteType");
const router = Router();

router.post("/", controller.addInstituteType);
router.get("/get", controller.getInstituteType);
router.post("/edit/:id", controller.updateInstituteName);
router.delete("/delete/:id", controller.deleteInstituteType);

module.exports = router;
