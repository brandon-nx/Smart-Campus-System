const bodyParser = require("body-parser");
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

const eventRoutes = require("./routes/events");
const authRoutes = require("./routes/auth");

app.use(cors());

// Set up the MySQL connection pool
const db = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'E(yYM{PT%pvkm~.i',
  database: 'AppDB',
});

// Test the database connection
app.get('/', (req, res) => {
  db.query("INSERT INTO test (idtest, testcol) VALUES (1, 'lol')");
});

// // (Optional) Make the db connection available to routes
// app.use((req, res, next) => {
//   req.db = db;
//   next();
// });

// Use body-parser to parse JSON requests
// app.use(bodyParser.json());

// Set up CORS headers
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
//   next();
// });

// // Set up authentication routes
// app.use(authRoutes);

// // Set up events routes; these routes will be prefixed with '/events'
// app.use("/events", eventRoutes);

// // Error-handling middleware
// app.use((error, req, res, next) => {
//   const status = error.status || 500;
//   const message = error.message || "Something went wrong.";
//   res.status(status).json({ message: message });
// });

// Start the Express server on a port different from MySQL's port
app.listen(8080, () => {
  console.log("Express server is running on http://127.0.0.1:8080");
});