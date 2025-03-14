// user adding and retrieving functions

const { hash } = require("bcryptjs");
const db = require("../db");
const { generateKey } = require("../scripts/keygen");

// add user to DB
async function add(data) {
  const hashedPw = await hash(data.password, 12);
  const gender = data.gender;
  const dateOfBirth = data.dateOfBirth;
  const name = data.name;
  const email = data.email;
  const profilePicture = data.profilePicture;
  // check if user already exists
  const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (results.length > 0) {
    return 1;
  }

  // register to database then return user and email
  db.query(
    'INSERT INTO users (email, username, password, type, gender, dateOfBirth, profilepicture) VALUES (?, ?, ?, "user", ?, STR_TO_DATE(?, "%Y-%m-%d"), ?)',
    [email, name, hashedPw, gender, dateOfBirth, profilePicture],
    (err, results) => {
      if (err) {
        console.log("[!SQL!]Error inserting data: " + err);
      }
      if (results) {
        return { name, email };
      }
    }
  );
}

//
async function get(data) {
  const email = data.email;
  db.query("SELECT * FROM users WHERE email = ?", [email], (_, results) => {
    if (results.length <= 0) {
      return 0;
    } else {
      return results;
    }
  });
}

// generate session key for each remembered login
async function sessionkeygen(email) {
  const key = generateKey();
  db.query(
    "INSERT INTO auth_token (email, token) VALUES (?, ?)",
    [email, key],
    (err, _) => {
      if (err) {
        console.log("[!SQL!]Error inserting new session key: ", err);
        return 0;
      }
    }
  );
  return key;
}

exports.add = add;
exports.get = get;
exports.sessionkeygen = sessionkeygen;
