// handle app requests here

const express = require("express");
const { add, get } = require("../data/user");
const {
  isEmail,
  isNotEmpty,
  isPassword,
  hasMinLength,
} = require("../util/validation");
const { connection } = require("../scripts/mysqlConnection");
const { generateKey } = require("../scripts/keygen");
const router = express.Router();

// signup requests
router.post("/signup", async (req, res, next) => {
  const data = req.body;
  console.log("[REQ] Get signup request:", data);
  let errors = {};
  // check if email is valid
  if (!isValidEmail(data.email)) {
    errors.email = "[!SIGNIN!] Invalid email.";
  } else {
    try {
      const existingUser = await get(data);
      if (!existingUser === 0) {
        (errors.email = "[!SIGNIN!] Email"), data.email, "exists already.";
      }
    } catch (error) {
      console.log("[!SIGNIN!] Error with email:", error);
    }
  }
  if (!isValidText(data.name, 2)) {
    console.log("[!SIGNIN!] Error with name:", data.name);
    errors.name = "Invalid name. Must not be empty";
  }

  // check if password is valid
  if (!isValidText(data.password, 8)) {
    console.log("[!SIGNIN!] Error with password:", data.password);
    errors.password = "Invalid password. Must be at least 8 characters long.";
  }
  // send error data to app
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "[!SIGNIN!]User signup failed due to validation errors.",
      errors,
    });
  }

  try {
    const createdUser = await add(data);
    res.status(201).json({
      message: "[SIGNIN] User successfully created.",
      user: createdUser,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password, rememberMe } = req.body;
  const errors = {};

  // Validate email
  if (!isNotEmpty(email)) {
    errors.email = { field: "email", message: "Email cannot be empty" };
  } else if (!isEmail(email)) {
    errors.email = {
      field: "email",
      message: "Email must be a valid soton.ac.uk email",
    };
  }

  // Validate password
  if (!isNotEmpty(password)) {
    errors.password = {
      field: "password",
      message: "Password cannot be empty",
    };
  } else if (!hasMinLength(password, 6)) {
    errors.password = {
      field: "password",
      message: "Password must be at least 6 characters long",
    };
  }

  // If any validation errors exist, return them
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Validation errors occurred",
      status: 400,
      errors: Object.values(errors),
    });
  }

  // Proceed with login query
  connection.query(
    "SELECT (email, password) FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.log("[!SQL!] Error executing query:", err);
        return res.status(500).json({
          message: "Internal server error",
          status: 500,
          errors: [],
        });
      }
      if (!results || results.length === 0) {
        return res.status(401).json({
          message: "Invalid username or password",
          status: 401,
          errors: [{ field: "email", message: "User not found" }],
        });
      }
      // Check if the password matches (replace with proper hash checking in production)
      if (password !== results[0].password) {
        return res.status(401).json({
          message: "Invalid username or password",
          status: 401,
          errors: [{ field: "password", message: "Incorrect password" }],
        });
      }

      // If "remember me" is checked, generate a token and save it
      let token = null;
      if (rememberMe) {
        token = generateKey();
        connection.query(newauthtokenquery, [email, token], (err2) => {
          if (err2) {
            console.log("[!SQL!] Error saving token:", err2);
            // Optionally handle token save error here
          }
        });
      }
      return res.json({ token });
    }
  );
});

router.post("/tokenlogin", async (req, res) => {
  const email = req.body.email;
  const token = req.body.token;
  console.log("[REQ] Get token login request:", email, token);
  connection.query(
    "INSERT INTO auth_token (email,token) VALUES (?, ?)",
    [email, token],
    (err, results) => {
      if (err) {
        console.log("[!SQL!]Error executing query:", err);
      }
      if (results.length == 1) {
        res.json({ message: "User logged in.", user: results[0] });
      } else {
        res.status(401).json({ message: "Authentication failed." });
      }
    }
  );
});

router.post("/logout", async (req, res) => {
  const token = req.body.token;
  connection.query(deleteauthtokenquery, [token], (err, _) => {
    if (err) {
      console.log("[!SQL!]Error executing query:", err);
    }
    res.json({ message: "User logged out." });
  });
});

module.exports = router;
