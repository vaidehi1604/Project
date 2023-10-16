//for express
const express = require("express");
const app = express();
const mainRoutes = require("../Project/routes/routes");
const studentRoutes = require("./routes/student");
const instituteType = require("./routes/instituteType");
const client = require("./database");

// client.query("select * from demo", (err, result) => {
//   if (err) {
//     console.error("Error executing query:", err.message);
//   } else {
//     console.log(result.rows);
//   }
//   client.end();
// });

//for ejs,pug,handlebars
app.set("view engine", "ejs");
app.use(express.static("public"));
//get port number
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(mainRoutes);
app.use("/student", studentRoutes);
app.use("/instituteType", instituteType);

app.listen(PORT, (server) => {
  console.log(`server is running on ${PORT}`);
});
