const express = require("express");
const {
  isNotEmpty,
  isValidText,
  isEqualsToOtherValue,
  isRealisticDate,
  isAtLeast18,
} = require("../util/validation");
const { hash } = require("bcryptjs");
const db = require("../db");
const router = express.Router();
const profileImages = require("../data/profileimages");

router.get("/", async (req, res) => {
  const { email } = req.query;
  try {
    const [rows] = await db.query(
      `
        SELECT email, username, type, gender, DATE_FORMAT(dateOfBirth, '%Y-%m-%d') AS dateOfBirth, profilepicture FROM users WHERE email = ?
      `,
      [email]
    );

    if (rows.length === 0) {
      return res.status(422).json({
        message: "Account not found!",
      });
    }

    const user = rows[0];

    console.log(user)

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    user.profilepicture = `${baseUrl}/uploads/${user.profilepicture}`;

    return res.json(user);
  } catch (err) {
    console.error("Error fetching account:", err);
    return res.status(500).json({ message: "Failed to fetch account!" });
  }
});

router.get("/profile-images", (req, res) => {
  try {
    if (!profileImages.length) {
      return res.status(422).json({ message: "No Profile Images found!" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const images = profileImages.map(({ path, caption }) => ({
      url: `${baseUrl}/uploads/${path}`,
      caption,
    }));

    console.log(images);

    return res.json(images);
  } catch (err) {
    console.error("Error fetching profile images:", err);
    return res.status(500).json({ message: "Failed to fetch profile images!" });
  }
});

router.put("/update", async (req, res) => {
  const account = req.body;
  const { email } = account;

  const updatable = [
    "username",
    "profilePicture",
    "dateOfBirth",
    "gender",
    "password",
  ];
  const sentFields = updatable.filter((f) => f in account);
  if (sentFields.length !== 1) {
    return res.status(422).json([
      {
        field: "general",
        message:
          "Please update exactly one of: " +
          updatable.join(", ") +
          "at a time.",
      },
    ]);
  }

  const field = sentFields[0];
  let value = account[field];

  console.log(sentFields);
  console.log(field);
  console.log(value);

  if (field === "username" && !isValidText(value, 2)) {
    return res
      .status(422)
      .json([
        { field, message: "Invalid name. Must be at least 2 characters long." },
      ]);
  }

  if (field === "profilePicture" && (value === null || !isNotEmpty(value))) {
    return res.status(422).json([
      {
        field,
        message: "Invalid image. Must be a valid image value.",
      },
    ]);
  }

  if (field === "gender" && (value === null || !isNotEmpty(value))) {
    return res.status(422).json([
      {
        field,
        message: "Invalid gender. Must be a valid gender value.",
      },
    ]);
  }

  if (field === "dateOfBirth") {
    if (!isRealisticDate(value)) {
      return res.status(422).json([
        {
          field,
          message: "Invalid date of birth. Please enter a realistic date.",
        },
      ]);
    } else if (!isAtLeast18(value)) {
      return res.status(422).json([
        {
          field,
          message: "Invalid date of birth. You must be at least 18 years old.",
        },
      ]);
    }
  }

  if (field === "password") {
    const { confirmPassword } = account;
    if (!isValidText(value, 8)) {
      return res.status(422).json([
        {
          field,
          message: "Invalid password. Must be at least 8 characters long.",
        },
      ]);
    }
    if (!isEqualsToOtherValue(value, confirmPassword)) {
      return res.status(422).json([
        {
          field: "confirmPassword",
          message: "Password do not match. Try again.",
        },
      ]);
    }

    value = await hash(value, 12);

    console.log("hashed pw: " + value);
  }

  const columnMap = {
    username: "username",
    password: "password",
    profilePicture: "profilepicture",
    gender: "gender",
    dateOfBirth: "dateOfBirth",
  };

  const column = columnMap[field];

  try {
    const [result] = await db.query(
      `UPDATE users SET \`${column}\` = ? WHERE email = ?`,
      [value, email]
    );

    if (result.affectedRows === 0) {
      return res.status(422).json([
        {
          field: "general",
          message: "Update failed. Account not found!",
        },
      ]);
    }

    let successMessage = "";

    if (field === "profilePicture") {
      successMessage = "Your profile picture has been updated successfully!";
    } else if (field === "username") {
      successMessage = "Your name has been updated successfully!";
    } else if (field === "gender") {
      successMessage = "Your gender has been updated successfully!";
    } else if (field === "dateOfBirth") {
      successMessage = "Your date of birth has been updated successfully!";
    } else if (field === "password") {
      successMessage = "Your password has been updated successfully!";
    }

    return res.json({
      successes: [
        {
          field,
          message: successMessage,
        },
      ],
    });
  } catch (err) {
    console.error(`Error updating ${field}:`, err);
    return res.status(500).json({ message: "Failed to update account!" });
  }
});

module.exports = router;
