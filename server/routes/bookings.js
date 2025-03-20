// handle app requests here
const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/categories", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, type_name FROM room_type");
    return res.json(rows);
  } catch (err) {
    console.error("Error fetching booking categories:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch booking categories!" });
  }
});

router.get("/rooms", async (req, res) => {
  const { id, search } = req.query;

  try {
    let sql = `
      SELECT roomID, roomName, roomDescription, roomCapacity, room_type_id
      FROM venue
      WHERE room_type_id = ?
    `;
    const params = [id];

    if (search && search.trim() !== "") {
      sql += " AND roomName LIKE ?";
      params.push(`%${search}%`);
    }

    // Execute the query with parameters.
    const [rows] = await db.query(sql, params);
    return res.json(rows);
  } catch (error) {
    console.error("Error fetching rooms:", err);
    return res.status(500).json({ message: "Failed to fetch rooms" });
  }
});

module.exports = router;
