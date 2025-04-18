const express = require("express");
const db = require("../db");
const router = express.Router();
// Data visualisation syncing
router.get("/eventbookingsync", async (req, res) => {
    try {
      const [event] = await db.query(`SELECT 
    DATE_FORMAT(eventstart, '%M') AS month,
    COUNT(*) AS value
FROM 
    events
WHERE 
    eventstart <= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY 
    month
ORDER BY 
    month;`);
      return res.json(event);
    } catch (error) {
    return res.status(500).json({ message: "Failed to fetch rooms" });
    }
  })
  // Room booking count sorted by month
  // tested works, no queries as of now because too lazy to manually insert data. To test,
  // remove the WHERE line in the query or flip the less than (<=) to more than (>=) below the where
  // - 16/4/25
  router.get("/roombookingsync", async (req, res) => {
    try {
      const [event] = await db.query(`SELECT month,name,value
FROM (
    SELECT 
        DATE_FORMAT(booking_date, '%M') AS month,
        roomID AS name,
        COUNT(*) AS value
    FROM 
        bookings
    GROUP BY 
        month, name
) AS aggregated_data
ORDER BY 
    MONTH(STR_TO_DATE(month, '%M'));`);
      return res.json(event);
    } catch (error) {
    return res.status(500).json({ message: "Failed to fetch rooms" });
    }
  })
  // attendance for each event
  router.get("/attendancesync", async (req, res) => {
    try {
      const [event] = await db.query(`SELECT 
    DATE_FORMAT(e.eventstart, '%M') AS month, 
    e.eventname AS name,
    e.eventcapacity,
    COUNT(er.idreservations) AS value
FROM 
    events e
LEFT JOIN 
    eventreservations er ON e.idevent = er.idreservations
GROUP BY 
    month, e.idevent, e.eventcapacity
ORDER BY 
    month;`);
      return res.json(event);
    } catch (error) {
    return res.status(500).json({ message: "Failed to fetch rooms" });
    }
  })

  router.post("/postAnnouncement", async (req, res) => {
    console.log(req.body.message)
    try {
      const result = await db.query(`INSERT INTO announcements (message) VALUES (?)`, [req.body.message]);
      if (result) {
        return res.status(201).json({ message: "Announcement posted successfully." });
      }
    } catch (err) {
      console.error("[!SQL!] Error inserting data: " + err);
      return res.status(500).json({ error: "An error occurred while posting the announcement." });
    }
  });
  router.post("/addNewEvent", async (req, res) => {
    try {
      const { eventname, eventdescription, eventstart, eventend, eventcapacity, eventimage, roomid, event_type_id } = req.body;
      console.log ()
      const result = await db.query(
        `INSERT INTO events (eventname, eventdescription, eventstart, eventend, eventcapacity, eventimage, roomid, event_type_id) VALUES (?, ?, STR_TO_DATE(?, '%Y-%m-%d %l:%i%p'), STR_TO_DATE(?, '%Y-%m-%d %l:%i%p'), ?, ?, ?, ?)`,
        [eventname, eventdescription, eventstart, eventend, eventcapacity, eventimage, roomid, event_type_id]
      );
      if (result) {
        return res.status(201).json({ message: "Event added successfully." });
      }
    } catch (err) {
      console.error("[!SQL!] Error inserting data: " + err);
      return res.status(500).json({ error: "An error occurred while inserting data." });
    }
  });
  router.post("/addNewRoom", async (req, res) => {
    try {
      const { roomID, roomName, roomDescription, roomCapacity, room_type_id } = req.body;
      const result = await db.query(
        `INSERT INTO venue (roomID, roomName, roomDescription, roomCapacity, room_type_id) VALUES (?, ?, ?, ?, ?)`,
        [roomID, roomName, roomDescription, roomCapacity, room_type_id]
      );
      if (result) {
        return res.status(201).json({ message: "Room added successfully." });
      }
    } catch (err) {
      console.error("[!SQL!] Error inserting data: " + err);
      return res.status(500).json({ error: "An error occurred while adding the room." });
    }
  });
module.exports = router;