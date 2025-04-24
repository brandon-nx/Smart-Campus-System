require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const eventRoutes = require("./routes/events");
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
const notificationRoutes = require("./routes/notifications");
const adminRoutes = require("./routes/admin");
const accountRoutes = require("./routes/account");
const db = require("./db");
const path = require("path");

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN, // Change if needed, from .env
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

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

// Set up authentication routes
app.use("/api", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Error-handling middleware
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  res.status(status).json({ message: message });
});

const PORT = process.env.PORT || 3000;

//Start server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
