const router = require("express").Router();
//require for file path
const path = require("path");
//get html file on default route
router.get("/", (req, res) => {
  res.render("dashboard", {
    title: "My Project",
  });
});

//
router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/file", (req, res) => {
  res.sendFile(path.resolve(__dirname) + "/public/download.html");
});

router.get("/download", (req, res) => {
  res.download(path.resolve(__dirname) + "/public/download.html");
});

module.exports = router;
