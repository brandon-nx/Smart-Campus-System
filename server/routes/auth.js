// handle app requests here

const express = require("express");
const { add, get } = require("../data/user");
const {
  isEmail,
  isNotEmpty,
  isPassword,
  hasMinLength,
} = require("../util/validation");
const db = require("../db");
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

  try {
    // Query the database with the corrected SQL statement
    const [results] = await db.query(
      "SELECT email, password FROM users WHERE email = ?",
      [email]
    );

    if (!results || results.length === 0) {
      return res.status(401).json({
        message: "Invalid username or password",
        status: 401,
        errors: [{ field: "email", message: "User not found" }],
      });
    }

    // Compare provided password with the one in the database
    // In production, use hashed passwords and a library like bcrypt
    if (password !== results[0].password) {
      return res.status(401).json({
        message: "Invalid username or password",
        status: 401,
        errors: [{ field: "password", message: "Incorrect password" }],
      });
    }

    // Optionally handle "remember me"
    let token = null;
    if (rememberMe) {
      token = generateKey(); // Ensure generateKey is defined
      await connection.query(newauthtokenquery, [email, token]);
    }
    return res.json({ token });
  } catch (err) {
    console.error("[!SQL!] Error executing query:", err);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      errors: [],
    });
  }
});

router.post("/tokenlogin", async (req, res) => {
  const email = req.body.email;
  const token = req.body.token;
  console.log("[REQ] Get token login request:", email, token);
  db.query(
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
