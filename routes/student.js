const { Router } = require("express");
const controller = require("../controllers/student");
const router = Router();

router.get("/", controller.getStudent);

router.get("/:id", controller.getStudentById);

router.post("/", controller.addStudent);

router.delete("/:id", controller.removeStudent);

module.exports = router;
