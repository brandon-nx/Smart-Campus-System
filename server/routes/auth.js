// handle app requests here

const express = require("express");
const { add, get } = require("../data/user");
const {
  isEmail,
  isNotEmpty,
  isValidText,
  isValidDate,
  isValidImageUrl,
  isEqualsToOtherValue,
  isRealisticDate,
  isAtLeast18,
  hasMinLength,
} = require("../util/validation");
const db = require("../db");
const { generateKey } = require("../scripts/keygen");
const { hash, compare } = require("bcryptjs");
const { sendMail } = require("../util/mail");
const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const data = req.body;
  console.log("[REQ] Get signup request:", data);
  let errors = {};

  // Validate email
  if (!isNotEmpty(data.email)) {
    errors.email = { field: "email", message: "Email is required." };
  } else if (!isEmail(data.email)) {
    errors.email = {
      field: "email",
      message: "Invalid email. Must be a valid soton.ac.uk email.",
    };
  } else {
    try {
      const existingUser = await get({ email: data.email });
      // Assuming get returns an array of matching users:
      if (existingUser && existingUser.length > 0) {
        errors.email = { field: "email", message: "Email already exists." };
      }
    } catch (error) {
      console.log("[!SIGNIN!] Error checking email:", error);
    }
  }

  // Validate name (username)
  if (!isValidText(data.name, 2)) {
    console.log("[!SIGNIN!] Error with name:", data.name);
    errors.name = {
      field: "name",
      message: "Invalid name. Must be at least 2 characters long.",
    };
  }

  // Validate password
  if (!isValidText(data.password, 8)) {
    console.log("[!SIGNIN!] Error with password:", data.password);
    errors.password = {
      field: "password",
      message: "Invalid password. Must be at least 8 characters long.",
    };
  }
  // Validate confirmPassword: must match password
  if (!isEqualsToOtherValue(data.password, data.confirmPassword)) {
    errors.confirmPassword = {
      field: "confirmPassword",
      message: "Passwords do not match.",
    };
  }

  // Validate gender
  if (data.gender === null || !isNotEmpty(data.gender)) {
    errors.gender = { field: "gender", message: "Gender is required." };
  }

  // Validate date of birth
  if (!isRealisticDate(data.dateOfBirth)) {
    errors.dateOfBirth = {
      field: "dateOfBirth",
      message: "Invalid date of birth. Please enter a realistic date.",
    };
  } else if (!isAtLeast18(data.dateOfBirth)) {
    errors.dateOfBirth = {
      field: "dateOfBirth",
      message: "Invalid date of birth. You must be at least 18 years old.",
    };
  }

  // For image, if not provided or invalid, use a placeholder URL
  if (!data.image || !isValidImageUrl(data.image)) {
    data.image = "https://example.com/placeholder.jpg";
  }

  // Set a default user type if not provided
  if (!data.type) {
    data.type = "user";
  }

  // If any validation errors exist, send them back
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "[!SIGNIN!] User signup failed due to validation errors.",
      status: 400,
      errors: Object.values(errors),
    });
  }

  // Prepare the data for insertion to match table columns:
  // email, username, password, type, gender, dateOfBirth, profilePicture
  const userData = {
    email: data.email,
    name: data.name,
    password: data.password, // In production, hash this password before storing!
    type: data.type,
    gender: data.gender,
    dateOfBirth: data.dateOfBirth,
    profilePicture: data.image,
  };

  try {
    const createdUser = await add(userData);
    if (createdUser == 1) {
      return res.status(422).json({
        message: "[!SIGNIN!] User signup failed due to a server error.",
        status: 422,
        errors: [
          (errors.email = { field: "email", message: "Email already exists." }),
        ],
      });
    } else if (createdUser == 0) {
      throw new Error("SQL Error");
    }

    return res.json({
      email: userData.email,
      message: "User successfully created.",
      success: true,
    });
  } catch (error) {
    console.error("[!SIGNIN!] Error creating user:", error);

    return res.status(500).json({
      message: "User signup failed due to a server error.",
      status: 500,
      errors: [],
    });
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
    const isMatch = await compare(password, results[0].password);
    if (!isMatch) {
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

    const user = results[0];

    return res.json({ email: user.email, token, success: true });
  } catch (err) {
    console.error("[!SQL!] Error executing query:", err);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      errors: [],
    });
  }
});

router.post("/request-otp", async (req, res) => {
  const { recoveryEmail } = req.body;

  let errors = {};

  // Validate email
  if (!isNotEmpty(recoveryEmail)) {
    errors.recoveryEmail = {
      field: "recoveryEmail",
      message: "Email cannot be empty",
    };
  } else if (!isEmail(recoveryEmail)) {
    errors.recoveryEmail = {
      field: "recoveryEmail",
      message: "Email must be a valid soton.ac.uk email",
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

  //Check email exist
  const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
    recoveryEmail,
  ]);

  if (!results.length) {
    {
      return res.status(422).json({
        message: "[!SIGNIN!] Request OTP failed due to a server error.",
        status: 422,
        errors: [
          (errors.recoveryEmail = {
            field: "recoveryEmail",
            message: "Email does not exists.",
          }),
        ],
      });
    }
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  // create otp_request in database
  try {
    await db.query("INSERT INTO otp_requests (email, otp) VALUES (?, ?)", [
      recoveryEmail,
      otp,
    ]);

    //Send otp to email
    await sendMail(
      recoveryEmail,
      "OTP Request Verification",
      `Your OTP Code is ${otp}`
    );

    return res.json({
      recoveryEmail,
      requestSuccess: true,
      message: "OTP sent successfully!",
    });
  } catch (err) {
    console.log("[!SQL!] Error inserting data: ", err);

    return res.status(500).json({
      message: "OTP request failed due to a server error.",
      status: 500,
      errors: [],
    });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { recoveryEmail, otp } = req.body;

  let errors = {};

  //Check otp_request exist
  const [result] = await db.query(
    "SELECT * FROM otp_requests WHERE email = ? ORDER BY created_at DESC LIMIT 1",
    [recoveryEmail]
  );

  if (!result) {
    return res.status(422).json({
      message: "[!SIGNIN!] OTP request not found.",
      status: 422,
      errors: [
        (errors.general = {
          field: "general",
          message: "No OTP request found.",
        }),
      ],
    });
  }

  //Expiry validation for otp
  const now = new Date();
  const createdAt = new Date(result[0].created_at);

  if ((now - createdAt) / 60000 > 10) {
    return res.status(422).json({
      message: "[!SIGNIN!] OTP request expired.",
      status: 422,
      errors: [
        (errors.general = {
          field: "general",
          message: "Sorry, OTP request has expired.",
        }),
      ],
    });
  }

  //Compare user entered otp and database otp
  if (result[0].otp !== otp) {
    return res.status(400).json({
      message: "[!SIGNIN!] Invalid User Input OTP.",
      status: 400,
      errors: [
        (errors.general = {
          field: "general",
          message: "Invalid OTP, please try again.",
        }),
        (errors.otp = {
          field: "otp",
          message: "Input OTP is wrong!",
        }),
      ],
    });
  }

  try {
    await db.query("UPDATE otp_requests SET verified = true WHERE id = ?", [
      result[0].id,
    ]);

    return res.json({
      otp,
      verifySuccess: true,
      message: "OTP verified successfully",
    });
  } catch (err) {
    console.log("[!SQL!] Error inserting data: ", err);

    return res.status(500).json({
      message: "OTP request failed due to a server error.",
      status: 500,
      errors: [],
    });
  }
});

router.post("/reset-password", async (req, res) => {
  const { recoveryEmail, newPassword, newConfirmPassword } = req.body;

  let errors = {};

  // Validate newPassword
  if (!isValidText(newPassword, 8)) {
    console.log("[!SIGNIN!] Error with password:", newPassword);
    errors.newPassword = {
      field: "newPassword",
      message: "Invalid new password. Must be at least 8 characters long.",
    };
  }
  // Validate newConfirmPassword: must match password
  if (!isEqualsToOtherValue(newPassword, newConfirmPassword)) {
    errors.newConfirmPassword = {
      field: "newConfirmPassword",
      message: "Passwords do not match.",
    };
  }

  // If any validation errors exist, send them back
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "[!SIGNIN!] User signup failed due to validation errors.",
      status: 400,
      errors: Object.values(errors),
    });
  }

  //Check otp_request valid
  const [result] = await db.query(
    "SELECT * FROM otp_requests WHERE email = ? AND verified = true ORDER BY created_at DESC LIMIT 1",
    [recoveryEmail]
  );

  if (!result) {
    return res.status(422).json({
      message: "[!SIGNIN!] Invalid or expired OTP.",
      status: 422,
      errors: [
        (errors.general = {
          field: "general",
          message: "Invalid or expired OTP Request",
        }),
      ],
    });
  }

  const hashedPw = await hash(newPassword, 12);

  try {
    await db.query("UPDATE users SET password = ? WHERE email = ?", [
      hashedPw,
      recoveryEmail,
    ]);

    return res.json({
      resetSuccess: true,
      message: "Your password has been changed successfully!",
    });
  } catch (err) {
    console.log("[!SQL!] Error inserting data: ", err);

    return res.status(500).json({
      message: "Updating password failed due to a server error.",
      status: 500,
      errors: [],
    });
  }
});

router.post("/cancel-otp", async (req, res) => {
  const { recoveryEmail } = req.body;

  try {
    await db.query("DELETE FROM otp_requests WHERE email = ?", [recoveryEmail]);
    return res.json({
      cancelSuccess: true,
      message: "OTP Process Cancelled.",
    });
  } catch (err) {
    console.log("[!SQL!]Error deleting otp requests: " + err);
    return res.status(500).json({
      message: "Deleting otp requests failed due to a server error.",
      status: 500,
      errors: [],
    });
  }
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
