const mysql = require("mysql2");

// Set up the MySQL connection pool
const db = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "E(yYM{PT%pvkm~.i",
  database: "AppDB",
});

module.exports = db.promise();
