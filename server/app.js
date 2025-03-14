const bodyParser = require("body-parser");
const express = require("express");

const eventRoutes = require("./routes/events");
const authRoutes = require("./routes/auth");
const db = require("./db");

const app = express();

// Test the database connection
db.query("SELECT 1")
  .then(([rows]) => console.log("DB test query succeeded:", rows))
  .catch((err) => console.error("DB test query failed:", err));

// Make the db connection available to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Use body-parser to parse JSON requests
app.use(bodyParser.json());

// Set up CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

// Set up authentication routes
app.use(authRoutes);
app.use("/events", eventRoutes);

// Error-handling middleware
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  res.status(status).json({ message: message });
});

//Start server
app.listen(8080, () => {
  console.log("server is running on port 8080");
});
