const UUID=require('uuid')


const instituteType = "CREATE TABLE instituteType (id UUID PRIMARY KEY, name VARCHAR(255))";
const addInstituteType = "INSERT INTO instituteType (id, name) VALUES ($1, $2)";

// const instituteType = "CREATE TABLE instituteType (id,name) VALUES (UUID PRIMARY KEY DEFAULT uuid_generate_v4(),$2)";
// const addInstituteType = "INSERT INTO instituteType (id,name) VALUES ($1,$2) ";
module.exports = {
  instituteType,
  addInstituteType,
};
