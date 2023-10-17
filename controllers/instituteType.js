const client = require("../database");
const queries = require("../queries/instituteType");
const { v4: uuidv4 } = require("uuid");

/**
 * @name addInstituteType
 * @file InstitueTypeController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This method will create institute types and add data to database
 * @author vaidehi
 */
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

/**
 * @name getInstituteType
 * @file InstitueTypeController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This method will create institute types and add data to database
 * @author vaidehi
 */
const getInstituteType = async (req, res) => {
  try {
    // Construct SQL query for retrieving institute types
    const selectClause = `
      SELECT itm.id, itm.name
      FROM institutetype as itm
      ORDER BY itm.id ASC
    `;

    const instituteTypeResult = await client.query(selectClause);

    if (instituteTypeResult.rows) {
      console.log("Retrieved institute types successfully");
      // Return the data as JSON response
      return res.status(200).json({
        total: instituteTypeResult.rows.length,
        data: instituteTypeResult.rows,
      });
    } else {
      console.log("No data retrieved");
      // Return an empty array and a 200 status code if there's no data
      return res.status(200).json({
        total: 0,
        data: [],
      });
    }
  } catch (error) {
    console.error("An error occurred while fetching institute types:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @name updateInstituteName
 * @file InstitueTypeController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This method will create institute types and add data to database
 * @author vaidehi
 */
const updateInstituteName = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Construct a SQL query to update the institute name
    const updateQuery = `
      UPDATE institutetype
      SET name = $1
      WHERE id = $2
    `;

    const result = await client.query(updateQuery, [name, id]);

    if (result.rowCount === 1) {
      console.log(`Updated institute name with ID ${id}`);
      res.status(200).json({ message: "Institute name updated successfully" });
    } else {
      console.log(`Institute with ID ${id} not found`);
      res.status(404).json({ error: "Institute not found" });
    }
  } catch (error) {
    console.error("An error occurred while updating institute name:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @name updateInstituteName
 * @file InstitueTypeController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This method will create institute types and add data to database
 * @author vaidehi
 */
const deleteInstituteType = async (req, res) => {
  try {
    const { id } = req.params;

    // Construct a SQL query to update the institute name
    const deleteQuery = `
    DELETE FROM institutetype WHERE id = $1
    `;

    const result = await client.query(deleteQuery, [id]);

    if (result.rowCount === 1) {
      console.log(`Delete institute with ID ${id}`);
      res.status(200).json({ message: "Institute Delete successfully" });
    } else {
      console.log(`Institute with ID ${id} not found`);
      res.status(404).json({ error: "Institute not found" });
    }
  } catch (error) {
    console.error("An error occurred while deleting institute:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addInstituteType,
  getInstituteType,
  updateInstituteName,
  deleteInstituteType,
};
