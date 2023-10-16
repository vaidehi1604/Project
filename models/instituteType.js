const client = require("../database");

client.query(
  `
  CREATE TABLE instituteType (
    id serial PRIMARY KEY,
    name VARCHAR (255),

  )
`,
  (err, result) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table created successfully");
    }
    pool.end(); // Don't forget to close the connection pool
  }
);
