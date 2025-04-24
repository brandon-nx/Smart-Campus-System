const express = require("express");
const db = require("../db");
const router = express.Router();

const { getAll, get, add, replace, remove } = require("../data/event");
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require("../util/validation");
router.get("/all", async (req, res) => {
  const { id } = req.query;

  try {
    let sql = `
      SELECT *
      FROM events
      left join event_type on events.event_type_id = event_type.id
      WHERE type_name = ?
    `;
    const params = [id];

    // Execute the query with parameters.
    const [rows] = await db.query(sql, params);
    return res.json(rows);
  } catch (error) {
    console.error("Error fetching rooms:", err);
    return res.status(500).json({ message: "Failed to fetch rooms" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, type_name FROM event_type");
    return res.json(rows);
  } catch (err) {
    console.error("Error fetching event categories:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch event categories!" });
  }
});

router.get("/allevents", async (req, res) => {
  const { id, search } = req.query;

  try {
    let sql = `
      SELECT  e.idevent,
                    e.eventname,
                    e.eventdescription,
                    e.eventstart,
                    e.eventend,
                    e.eventcapacity,
                    e.eventimage,
                    e.roomid,
                    v.roomName,
                    e.event_type_id,
                    e.status
            FROM events      AS e
            JOIN venue       AS v ON e.roomid = v.roomID
            WHERE e.event_type_id = ?
              AND e.status = 'Open'
    `;
    const params = [id];

    if (search && search.trim() !== "") {
      sql += " AND e.eventname LIKE ?";
      params.push(`%${search}%`);
    }

    // Execute the query with parameters.
    const [rows] = await db.query(sql, params);
    console.log(rows);
    return res.json(rows);
  } catch (error) {
    console.error("Error fetching events:", err);
    return res.status(500).json({ message: "Failed to fetch events" });
  }
});

router.get("/events", async (req, res) => {
  const { id, search } = req.query;

  try {
    let sql = `
      SELECT  e.idevent,
                    e.eventname,
                    e.eventdescription,
                    e.eventstart,
                    e.eventend,
                    e.eventcapacity,
                    e.eventimage,
                    e.roomid,
                    v.roomName,
                    e.event_type_id,
                    e.status
            FROM events      AS e
            JOIN venue       AS v ON e.roomid = v.roomID
            WHERE e.event_type_id = ?
              AND e.status = 'Open'
              AND e.eventstart >= CURDATE()
    `;
    const params = [id];

    if (search && search.trim() !== "") {
      sql += " AND e.eventname LIKE ?";
      params.push(`%${search}%`);
    }

    // Execute the query with parameters.
    const [rows] = await db.query(sql, params);
    console.log(rows);
    return res.json(rows);
  } catch (error) {
    console.error("Error fetching events:", err);
    return res.status(500).json({ message: "Failed to fetch events" });
  }
});

router.get("/events/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ message: "idevent is required in the request body" });
  }

  try {
    // 1) Query the event + room name
    const [rows] = await db.query(
      `
            SELECT  e.idevent,
              e.eventname,
              e.eventdescription,
              e.eventstart,
              e.eventend,
              e.eventcapacity,
              e.eventimage,
              e.status,
              e.roomid        AS venue_id,
              v.roomName      AS venue_name,

              /* remaining seats = capacity - number of rows in attendance table */
              e.eventcapacity - IFNULL(a.attendees, 0) AS remaining_capacity,
              IFNULL(a.attendees, 0)                   AS attendees_count
      FROM    events AS e
      JOIN    venue  AS v  ON e.roomid = v.roomID
      LEFT JOIN (
          SELECT idevent, COUNT(*) AS attendees
          FROM   event_attendance
          GROUP  BY idevent
      ) AS a ON a.idevent = e.idevent
      WHERE   e.idevent = ?
      GROUP BY e.idevent
    `,
      [id]
    );

    console.log(rows);
    // If no rows found, return 404 or handle as you wish
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No event found with that idevent" });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({ message: "Failed to fetch event" });
  }
});

router.post("/events/:id/rsvp", async (req, res) => {
  const { id, email } = req.body;
  console.log("[REQ] Get rsvp request:", id, email);

  try {
    const [eventRows] = await db.query(
      `
    SELECT eventcapacity, eventstart FROM events WHERE idevent = ?
  `,
      [id]
    );

    if (eventRows.length === 0) {
      return res.status(422).json({
        message: "RSVP Failed, Event not found!",
        status: 422,
      });
    }

    const { eventcapacity: capacity, eventstart } = eventRows[0];

    const now = new Date();
    const startDate =
      eventstart instanceof Date ? eventstart : new Date(eventstart);

    if (startDate <= now) {
      return res.status(422).json({
        message: "RSVP Failed, Event has already started or is in the past!",
        status: 422,
      });
    }

    const [[{ attendees }]] = await db.query(
      `
      SELECT COUNT(*) AS attendees FROM event_attendance WHERE idevent = ?
      `,
      [id]
    );

    if (attendees >= capacity) {
      return res.status(422).json({
        message: "RSVP Failed, Event is at full capacity!",
        status: 422,
      });
    }

    const [result] = await db.query(
      `
      INSERT IGNORE INTO event_attendance (idevent, user_email) VALUES (?, ?)
      `,
      [id, email]
    );

    if (result.affectedRows === 0) {
      return res.status(422).json({
        message: "RSVP Failed, You have already RSVP'd!",
        status: 422,
      });
    }

    return res.json({
      message: "Your RSVP has been confirmed successfully!",
      success: true,
    });
  } catch (error) {
    console.error("[!SIGNIN!] Error RSVP:", error);

    return res.status(500).json({
      message: "RSVP failed due to a server error.",
      status: 500,
    });
  }
});

router.post("/", async (req, res, next) => {
  console.log(req.token);
  const data = req.body;

  let errors = {};

  if (!isValidText(data.title)) {
    errors.title = "Invalid title.";
  }

  if (!isValidText(data.description)) {
    errors.description = "Invalid description.";
  }

  if (!isValidDate(data.date)) {
    errors.date = "Invalid date.";
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = "Invalid image.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Adding the event failed due to validation errors.",
      errors,
    });
  }

  try {
    await add(data);
    res.status(201).json({ message: "Event saved.", event: data });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const data = req.body;

  if (!isValidText(data.title)) {
    errors.title = "Invalid title.";
  }

  if (!isValidText(data.description)) {
    errors.description = "Invalid description.";
  }

  if (!isValidDate(data.date)) {
    errors.date = "Invalid date.";
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = "Invalid image.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Updating the event failed due to validation errors.",
      errors,
    });
  }

  try {
    await replace(req.params.id, data);
    res.json({ message: "Event updated.", event: data });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await remove(req.params.id);
    res.json({ message: "Event deleted." });
  } catch (error) {
    next(error);
  }
});

router.post("/rsvp");

module.exports = router;
