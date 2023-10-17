const client = require("../database");
const queries = require("../queries/instituteType");
const { v4: uuidv4 } = require("uuid");

const addInstituteType = (req, res) => {
  const { name } = req.body;
  const id = uuidv4();

  client.query(
    "SELECT to_regclass('institutetype')",
    (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Error checking if the table exists:", checkErr);
        res.status(500).send("Internal server error");
      } else if (checkResult.rows[0].to_regclass) {
        // Step 2: The table already exists; insert data into it
        client.query(
          queries.addInstituteType,
          [id, name],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error("Error inserting data:", insertErr);
              res.status(500).send("Internal server error");
            } else {
              res.status(201).json({
                id,
                name,
                message: "Institute Type Created Successfully",
              });
            }
          }
        );
      } else {
        // Step 3: The table doesn't exist; create it and insert data
        client.query(queries.instituteType, (createErr, createResult) => {
          if (createErr) {
            console.error("Error creating institute type:", createErr);
            res.status(500).send("Internal server error");
          } else {
            client.query(
              queries.addInstituteType,
              [id, name],
              (insertErr, insertResult) => {
                if (insertErr) {
                  console.error("Error inserting data:", insertErr);
                  res.status(500).send("Internal server error");
                } else {
                  res.status(201).json({
                    id,
                    name,
                    message: "Institute Type Created Successfully",
                  });
                }
              }
            );
          }
        });
      }
    }
  );

  // client.query(queries.instituteType, (err, result) => {
  //   if (err) {
  //     console.error("Error creating institute type:", err);
  //     res.status(500).send("Internal server error");
  //   } else {
  //     res
  //       .status(201)
  //       .json({ id, message: "Institute Type Created Successfully" });
  //   }
  // });

  // client.query(queries.addInstituteType, [id, name], (err, result) => {
  //   if (err) throw err;
  //   res.status(201).json("Student Created Successfully!!");
  // });
};

module.exports = {
  addInstituteType,
};
