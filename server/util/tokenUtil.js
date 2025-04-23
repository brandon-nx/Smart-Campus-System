const jwt = require("jsonwebtoken");
const db = require("../db");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_LIFE = "1d";
const REFRESH_TOKEN_LIFE = "7d";

function generateAccessToken(email) {
  return jwt.sign({ email }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_LIFE,
  });
}

async function generateAndStoreRefreshToken(email) {
  const refreshToken = jwt.sign({ email }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_LIFE,
  });

  try {
    await db.query("INSERT INTO auth_token (email, token) VALUES (?, ?)", [
      email,
      refreshToken,
    ]);
  } catch (err) {
    console.log("[!SQL!] Error inserting data: ", err);

    return res.status(500).json({
      message: "Storing refresh token to database failed.",
      status: 500,
      errors: [],
    });
  }

  return refreshToken;
}

async function validateRefreshToken(refreshToken) {
  try {
    const [results] = await db.query(
      "SELECT at.email, u.type FROM auth_token AS at JOIN users AS u ON u.email = at.email WHERE at.token = ?",
      [refreshToken]
    );

    if(!results.length) {
      return null;
    }

    const {email, type} = results[0]

    console.log(results[0])

    return {email, type}
  } catch (err) {
    console.log("[!SQL!] Error validating data: ", err);
    return res.status(500).json({
      message: "Unable to validate refresh token from database.",
      status: 500,
      errors: [],
    });
  }
}

async function removeRefreshToken(refreshToken) {
  try {
    await db.query("DELETE FROM auth_token WHERE token = ?", [refreshToken]);
  } catch (err) {
    console.log("[!SQL!] Error inserting data: ", err);
    return res.status(500).json({
      message: "Storing refresh token to database failed.",
      status: 500,
      errors: [],
    });
  }
}

module.exports = {
  generateAccessToken,
  generateAndStoreRefreshToken,
  validateRefreshToken,
  removeRefreshToken,
};
