const client = require("../database");
const queries = require("../queries/student");

const getStudent = (req, res) => {
  client.query(queries.getStudent, (err, result) => {
    if (err) throw err;
    res.status(200).json(result.rows);
  });
  console.log("getting student");
};

const getStudentById = (req, res) => {
  const id = parseInt(req.params.id);
  client.query(queries.getStudentById, [id], (err, result) => {
    if (err) throw err;
    res.status(200).json(result.rows);
  });
};

const addStudent = (req, res) => {
  const { id, name, email } = req.body;

  client.query(queries.checkEmailExists, [email], (err, result) => {
    if (err) {
      console.error("Error checking email existence:", err.message);
      res.status(500).send("Internal server error");
    } else {
      console.log(result.rows);
      if (result.rows.length) {
        res.status(400).send("Email Already Exists");
      }
    }
  });

  client.query(queries.addStudent, [id, name, email], (err, result) => {
    if (err) throw err;
    res.status(201).json("Student Created Successfully!!");
  });
};

// const removeStudent = (req, res) => {
//   const id = parseInt(req.params.id);
//   console.log("id", id);

//   // Check if the student with the given ID exists
//   client.query(queries.getStudentById, [id], (err, result) => {
//     if (err) {
//       console.error("Error checking student existence:", err.message);
//       res.status(500).send("Internal server error");
//     } else {
//       const studentExists = result.rows.length > 0;
//       if (!studentExists) {
//         res.status(404).send("Student Does Not Exist");
//       } else {
//         // The student exists, proceed with removal
//         client.query(queries.removeStudent, [id], (removeErr, removeResult) => {
//           console.log(removeResult);

//           if (removeErr) {
//             console.error("Error removing student:", removeErr.message);
//             res.status(500).send("Internal server error");
//           } else {
//             res.status(200).send("Student Removed Successfully");
//           }
//         });
//       }
//     }
//   });
// };

// const removeStudent = (req, res) => {
//   const id = req.params.id;

//   client.query(queries.getStudentById, [id], (err, result) => {
//     const studentNotFound = !result.rows.length;
//     if (!studentNotFound) {
//       res.send("Student Does Not Exists!!");
//     } else {
//       client.query(queries.removeStudent, [id], (err, result) => {
//         if (err) throw err;
//         res.status(200).send("Student Removed Successfully");
//       });
//     }
//   });
// };

const removeStudent = (req, res) => {
    const id = req.params.id;
  
    client.query(queries.getStudentById, [id], (err, result) => {
      if (err) {
        console.error("Error checking student existence:", err.message);
        res.status(500).send("Internal server error");
      } else {
        const studentNotFound = !result.rows.length;
        if (studentNotFound) {
          res.status(404).send("Student Does Not Exist");
        } else {
          client.query(queries.removeStudent, [id], (removeErr, removeResult) => {
            if (removeErr) {
              console.error("Error removing student:", removeErr.message);
              res.status(500).send("Internal server error");
            } else {
              res.status(200).send("Student Removed Successfully");
            }
          });
        }
      }
    });
  };
  

module.exports = {
  getStudent,
  getStudentById,
  addStudent,
  removeStudent,
};
