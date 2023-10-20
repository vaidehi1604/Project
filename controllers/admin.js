const client = require("../database");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const your_secret_key_here = "nsihdiwyewgfubcxnbsyee";
const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");
/**
 * @name create
 * @file admin.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This method will create institute types and add data to database
 * @author vaidehi
 */
const create = (req, res) => {
  // get name from body
  let { name, email, password, phoneNo, city } = req.body;

  /* `is generating a unique identifier using the `uuidv4` function from the `uuid` library. */
  const id = uuidv4();

  /*SQL query  that will create a table named "instituteType" in the database.*/
  const create =
    "CREATE TABLE admin (id UUID PRIMARY KEY, name VARCHAR(255),email VARCHAR(255),password VARCHAR(255),phoneNo VARCHAR(10),city VARCHAR(20))";

  /* SQL query string that will insert data into the `instituteType` table. */
  const addData =
    "INSERT INTO admin (id, name,email,password,phoneNo,city) VALUES ($1,$2,$3,$4,$5,$6)";

  //hash password
  let hash = bcrypt.hashSync(password, 10);
  password = hash;
  // Step 1: check table already exists or not
  client.query("SELECT to_regclass('admin')", (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking if the table exists:", checkErr);
      res.status(500).send("Internal server error");
    } else if (checkResult.rows[0].to_regclass) {
      // Step 2: The table already exists; insert data into it
      client.query(
        addData,
        [id, name, email, password, phoneNo, city],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error inserting data:", insertErr);
            res.status(500).send("Internal server error");
          } else {
            res.status(201).json({
              message: "Admin Created Successfully",
              data: { id, name, email, password, phoneNo, city },
            });
          }
        }
      );
    } else {
      // Step 3: The table doesn't exist; create it and insert data
      client.query(create, (createErr, createResult) => {
        if (createErr) {
          console.error("Error creating institute type:", createErr);
          res.status(500).send("Internal server error");
        } else {
          client.query(
            addData,
            [id, name, email, password, phoneNo, city],
            (insertErr, insertResult) => {
              if (insertErr) {
                console.error("Error inserting data:", insertErr);
                res.status(500).send("Internal server error");
              } else {
                console.log("hello2");
                res.status(201).json({
                  message: "Admin Created Successfully",
                  data: { id, name, email, password, phoneNo, city },
                });
              }
            }
          );
        }
      });
    }
  });
};

/**
 * @name login
 * @file admin.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This method will create institute types and add data to database
 * @author vaidehi
 */
const login = (req, res) => {
  // get name from body
  let { email, password } = req.body;

  const query = "SELECT * FROM admin WHERE email = $1";

  client.query(query, [email], (queryErr, queryResult) => {
    if (queryErr) {
      console.error("Error querying database:", queryErr);
      res.status(500).send("Internal server error");
    } else {
      if (queryResult.rows.length === 1) {
        // User exists; compare provided password with hashed password from the database
        const { id, password: hashedPassword } = queryResult.rows[0];
        const passwordMatch = bcrypt.compareSync(password, hashedPassword);
        if (passwordMatch) {
          // Passwords match; generate a JWT token
          const payload = {
            id,
            email: email,
          };

          // Sign the token
          const token = jwt.sign(payload, your_secret_key_here, {
            expiresIn: "1h",
          });

          client.query(
            "ALTER TABLE admin  ADD COLUMN IF NOT EXISTS token VARCHAR(255);"
          );

          const updateQuery = "UPDATE admin SET token = $1 WHERE email = $2";

          client.query(
            updateQuery,
            [token, email],
            (updateErr, updateResult) => {
              if (updateErr) {
                console.error("Error updating admin:");
                // Handle the error, e.g., return an error response
              } else {
                // Admin updated successfully
                console.log("Admin updated:");
                // Handle success, e.g., return a success response
              }
            }
          );

          // Send the token as a response
          return res.json({ email: email, token: token });
        } else {
          // Passwords do not match
          return res.status(401).json({ error: "Token not generated failed" });
        }
      } else {
        // User does not exist
        return res.status(404).json({ error: "Admin data not found" });
      }
    }
  });
};

/**
 * @name forgotPassword
 * @file admin.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description forgot password api to send mail and send OTP
 * @author vaidehi
 */
const forgotPassword = async (req, res) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp);
    const template = path.join(__dirname, "../views/email.ejs");
    const emailFile = await ejs.renderFile(template, { otp: otp });

    const { email } = req.body;

    const query = "SELECT * FROM admin WHERE email = $1";

    client.query(query, [email], async (queryErr, queryResult) => {
      if (queryErr) {
        res.status(500).send("Internal server error");
      } else {
        if (queryResult.rows.length === 1) {
          client.query(
            "ALTER TABLE admin  ADD COLUMN IF NOT EXISTS otp VARCHAR(255);"
          );

          const updateQuery = "UPDATE admin SET otp = $1 WHERE email = $2";

          client.query(updateQuery, [otp, email], (updateErr, updateResult) => {
            if (updateErr) {
              console.error("Error updating admin!!!!");
            } else {
              console.log("Admin OTP updated:");
            }
          });

          const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "3379c75fe59e63",
              pass: "f9162afb716029",
            },
          });

          let message = {
            from: "hello@gmail.com",
            to: email,
            subject: "Hello, World!",
            html: emailFile,
          };
          transporter.sendMail(message, (error, info) => {
            if (error) {
              console.error("Error sending email:", error);
              return res.status(500).json({ error: "Internal server error" });
            } else {
              return res.status(201).json({
                message: "You should receive an email",
              });
            }
          });
        } else {
          // User does not exist
          return res.status(404).json({ error: "Admin data not found" });
        }
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @name verifyOtp
 * @file admin.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description verify email
 * @author vaidehi
 */
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const query = "SELECT * FROM admin WHERE email = $1 AND otp=$2";

    client.query(query, [email, otp], async (queryErr, queryResult) => {
      if (queryErr) {
        res.status(500).send("Internal server error");
      } else {
        if (queryResult.rows.length === 1) {
          return res.status(404).json({ error: "OTP Verify successfully!!" });
        } else {
          // User does not exist
          return res.status(404).json({ error: "Invalid OTP" });
        }
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @name resetPassword
 * @file admin.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description verify email
 * @author vaidehi
 */
const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const query = "SELECT * FROM admin WHERE email = $1 AND otp = $2";

    client.query(query, [email, otp], async (queryErr, queryResult) => {
      if (queryErr) {
        console.error("Error querying database:", queryErr);
        return res.status(500).send("Internal server error");
      } else {
        if (queryResult.rows.length === 1) {
          const hashedPassword = bcrypt.hashSync(password, 10);
          const updateQuery = "UPDATE admin SET password = $1 WHERE email = $2";

          client.query(
            updateQuery,
            [hashedPassword, email],
            (updateErr, updateResult) => {
              if (updateErr) {
                console.error("Error updating password:", updateErr);
                return res.status(500).send("Internal server error");
              } else {
                console.log("Password updated");
                return res
                  .status(200)
                  .json({ message: "Password set successfully" });
              }
            }
          );
        } else {
          // User does not exist or invalid data
          return res.status(404).json({ error: "Invalid Data" });
        }
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  create,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
