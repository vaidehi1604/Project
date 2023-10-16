const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "vaidehi@1604",
  database: "new_project",
});

client.connect();

// client.query("select * from demo", (err, result) => {
//   if (err) {
//     console.error("Error executing query:", err.message);
//   } else {
//     console.log(result.rows);
//   }
//   client.end();
// });

module.exports = client;
