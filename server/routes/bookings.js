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

router.get("/rooms/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'roomID is required in the request body' });
  }

  try {
    // 1) Query the room + any associated amenities via LEFT JOIN
    const [rows] = await db.query(`
      SELECT 
        v.roomID, 
        v.roomName, 
        v.roomDescription, 
        v.roomCapacity, 
        v.room_type_id,
        a.id AS amenityId, 
        a.amenity_name
      FROM venue v
      LEFT JOIN venue_amenities va ON v.roomID = va.roomID
      LEFT JOIN amenities a ON va.amenity_id = a.id
      WHERE v.roomID = ?
    `, [id]);

    // If no rows found, return 404 or handle as you wish
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No room found with that roomID' });
    }

    // 2) Construct a single room object with an array of amenities
    //    (each row might have different amenity data, but the same room data)
    const {
      roomID,
      roomName,
      roomDescription,
      roomCapacity,
      room_type_id
    } = rows[0];

    // Gather amenities from all returned rows (filter out null if no amenities)
    const amenities = rows
      .filter(row => row.amenityId) // remove rows where amenity is null
      .map(row => ({
        id: row.amenityId,
        name: row.amenity_name
      }));

    // 3) Send the combined result
    const result = {
      roomID,
      roomName,
      roomDescription,
      roomCapacity,
      room_type_id,
      amenities
    };

    console.log(result)

    return res.json(result);
  } catch (error) {
    console.error("Error fetching room:", err);
    return res.status(500).json({ message: "Failed to fetch room" });
  }
});

module.exports = router;
