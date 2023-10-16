const client = require("../database");
const queries = require("../queries/instituteType");
const { v4: uuidv4 } = require("uuid");

const addInstituteType = (req, res) => {
  const { name } = req.body;
  const id = uuidv4();

  client.query("SELECT to_regclass('institutetype')", (err, result) => {
    if (err) {
      console.error("Error checking if the table exists:", err);
      res.status(500).send("Internal server error");
      return;
    }

    // Check if the table exists
    if (result.rows[0].to_regclass) {
      // The table already exists; no need to create it
      res.status(200).json("Institute Type Table Already Exists");
    } else {
      // The table doesn't exist; create it
      client.query(
        "CREATE TABLE instituteType (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name VARCHAR(255))",
        (createErr, createResult) => {
          if (createErr) {
            console.error("Error creating institute type table:", createErr);
            res.status(500).send("Internal server error");
          } else {
            res.status(201).json("Institute Type Table Created Successfully");
          }
        }
      );
    }
  });

  //   client.query(queries.instituteType, (err, result) => {
  //     if (err) {
  //       console.error("Error creating institute type:", err);
  //       res.status(500).send("Internal server error");
  //     } else {
  //       res
  //         .status(201)
  //         .json({ id, message: "Institute Type Created Successfully" });
  //     }
  //   });

  client.query(queries.addInstituteType, [id, name], (err, result) => {
    if (err) throw err;
    res.status(201).json("Student Created Successfully!!");
  });
};

module.exports = {
  addInstituteType,
};
