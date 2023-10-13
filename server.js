//for express
const express = require("express");
const app=express();
const mainRoutes = require('../Project/routes/routes');



//for ejs,pug,handlebars
app.set("view engine", "ejs");
app.use(express.static("public"));
//get port number
const PORT = process.env.PORT || 3002;

app.use(mainRoutes)

app.listen(PORT, (server) => {
  console.log(`server is running on ${PORT}`);
});
