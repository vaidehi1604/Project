const getStudent = "SELECT * FROM demo";
const getStudentById = "SELECT * FROM demo WHERE id=$1";
const checkEmailExists = "SELECT * FROM demo WHERE email = $1";
const addStudent = "INSERT INTO demo (id,name,email) VALUES ($1,$2,$3) ";
const removeStudent = "DELETE FROM demo WHERE id = $1";

module.exports = {
  getStudent,
  getStudentById,
  checkEmailExists,
  addStudent,
  removeStudent,
};
