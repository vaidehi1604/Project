// Import the Express.js framework.
const express = require("express");

// Create an Express application instance.
const app = express();

// Import the instituteType route module.
const instituteType = require("./routes/instituteType");

// Serve static files from the "public" folder.
app.use(express.static("public"));

// Define the port number for the server.
const PORT = process.env.PORT || 3002;

// Parse JSON request bodies.
app.use(express.json());

// Use the instituteType route for requests to "/instituteType".
app.use("/instituteType", instituteType);

app.listen(PORT, (server) => {
  // Start the server and listen on the specified port.
  console.log(`server is running on ${PORT}`);
});
