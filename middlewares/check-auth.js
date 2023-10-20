const jwt = require("jsonwebtoken");
const client = require("../database");
const your_secret_key_here = "nsihdiwyewgfubcxnbsyee";

const authenticate = async (req, res, next) => {
  try {
    // Getting the authToken from the headers
    const authToken = req.headers["authorization"];

    if (!authToken || !authToken.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid or missing token" });
    }

    const token = authToken.split(" ")[1];

    // Verify the JWT token
    jwt.verify(token, your_secret_key_here, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Assuming decodedToken contains user ID
      const userId = decodedToken.id;

      // Check if the user exists in the database
      const selectAdminQuery = `
        SELECT id, name, email,token
        FROM admin
        WHERE id = $1
      `;

      client.query(selectAdminQuery, [userId], (queryErr, queryResult) => {
        if (queryErr) {
          console.log(queryErr);
          console.error("Error querying database:", queryErr);
          return res.status(500).json({ message: "Internal server error" });
        }

        const admin = queryResult.rows[0];

        if (!admin) {
          return res.status(404).json({ message: "Admin not found" });
        }

        // Store the authenticated user data in the request object for later use
        req.authenticatedAdmin = admin;

        next(); // Proceed to the next middleware or route handler
      });
    });
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = authenticate;
