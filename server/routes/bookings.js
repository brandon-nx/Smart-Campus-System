// handle app requests here
const express = require("express");
const db = require("../db");
const {
  isValidBookingDate,
  isBookingDateTomorrow,
} = require("../util/validation");
const { getDayName } = require("../util/get");
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
    return res
      .status(400)
      .json({ message: "roomID is required in the request body" });
  }

  try {
    // 1) Query the room + any associated amenities via LEFT JOIN
    const [rows] = await db.query(
      `
      SELECT 
        v.roomID, 
        v.roomName, 
        v.roomDescription, 
        v.roomCapacity, 
        v.room_type_id,
        a.id AS amenityId, 
        a.amenity_name,
        oh.day_of_week,
        oh.open_time,
        oh.close_time
      FROM venue v
      LEFT JOIN venue_amenities va ON v.roomID = va.roomID
      LEFT JOIN amenities a ON va.amenity_id = a.id
      LEFT JOIN operational_hours oh ON v.roomID = oh.roomID
      WHERE v.roomID = ?
    `,
      [id]
    );

    console.log(rows);
    // If no rows found, return 404 or handle as you wish
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No room found with that roomID" });
    }

    // 2) Construct a single room object with an array of amenities
    //    (each row might have different amenity data, but the same room data)
    const { roomID, roomName, roomDescription, roomCapacity, room_type_id } =
      rows[0];

    // Gather amenities from all returned rows (filter out null if no amenities)
    const amenitiesMap = {};

    rows.forEach((row) => {
      if (row.amenityId && !amenitiesMap[row.amenityId]) {
        amenitiesMap[row.amenityId] = {
          id: row.amenityId,
          name: row.amenity_name,
        };
      }
    });

    const amenities = Object.values(amenitiesMap);

    // Gather operational hours from all returned rows
    const operationalHoursMap = {};

    rows.forEach((row) => {
      if (row.day_of_week) {
        if (!operationalHoursMap[row.day_of_week]) {
          operationalHoursMap[row.day_of_week] = {
            day: row.day_of_week,
            open: row.open_time,
            close: row.close_time,
          };
        }
      }
    });

    const operationalHours = Object.values(operationalHoursMap);

    // 3) Send the combined result
    const result = {
      roomID,
      roomName,
      roomDescription,
      roomCapacity,
      room_type_id,
      amenities,
      operationalHours,
    };

    console.log(result);

    return res.json(result);
  } catch (error) {
    console.error("Error fetching room:", error);
    return res.status(500).json({ message: "Failed to fetch room" });
  }
});

router.get("/rooms/:id/start-slots", async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  let errors = {};

  if (!isBookingDateTomorrow(date)) {
    console.log("[!SIGNIN!] Error with date (not tomorrow):", date);
    errors.bookingDate = {
      field: "bookingDate",
      message:
        "Invalid Date. Must be at least tomorrow. Same-day bookings are not allowed.",
    };
  } else if (!isValidBookingDate(date)) {
    console.log("[!SIGNIN!] Error with date (not within 1 month):", date);
    errors.bookingDate = {
      field: "bookingDate",
      message: "Invalid Date. Must be at least within one month from today.",
    };
  }

  // If any validation errors exist, send them back
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message:
        "[!SIGNIN!] Retrieve booking time slots (start) failed due to validation errors.",
      status: 422,
      errors: Object.values(errors),
    });
  }

  const dayName = getDayName(date);

  try {
    const [hourRows] = await db.query(
      `SELECT open_time, close_time FROM operational_hours WHERE roomID = ? AND day_of_week = ?`,
      [id, dayName]
    );

    console.log(hourRows, "Date" + date, "id" + id);
    // If no rows found, return 404
    if (hourRows.length === 0) {
      return res.status(404).json({
        message:
          "No time slots found! This room may not be operational at this date.",
      });
    }

    const { open_time, close_time } = hourRows[0];

    const [rows] = await db.query(
      `
    WITH RECURSIVE timeslots AS (
      SELECT CAST(? AS TIME) AS slot
      UNION ALL
      SELECT ADDTIME(slot, '00:30:00') 
      FROM timeslots 
      WHERE slot < SUBTIME(?, '01:00:00')
    )
    SELECT 
      ts.slot,
      CASE 
        WHEN EXISTS (
          SELECT 1 
          FROM bookings b
          WHERE b.roomID = ?
            AND b.booking_date = ?
            AND b.booking_status IN ('pending', 'confirmed')
            AND (
              TIME_TO_SEC(b.start_time) < TIME_TO_SEC(ADDTIME(ts.slot, '01:00:00'))
              AND TIME_TO_SEC(b.end_time) > TIME_TO_SEC(ts.slot)
            )
        )
        THEN 'unavailable'
        ELSE 'available'
      END AS status
    FROM timeslots ts
    ORDER BY ts.slot;
  `,
      [open_time, close_time, id, date]
    );

    console.log(rows);

    // 3) Send the combined result
    const result = {
      id,
      date,
      day: dayName,
      open_time,
      close_time,
      startSlots: rows,
      success: true,
    };

    console.log(result);

    return res.json(result);
  } catch (error) {
    console.error("Error retrieving start time slots:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch time slots(start)" });
  }
});

router.get("/rooms/:id/end-slots", async (req, res) => {
  const { id } = req.params;
  const { date, start } = req.query;

  const dayName = getDayName(date);

  try {
    const [hourRows] = await db.query(
      `SELECT open_time, close_time FROM operational_hours WHERE roomID = ? AND day_of_week = ?`,
      [id, dayName]
    );

    console.log(hourRows);
    // If no rows found, return 404
    if (hourRows.length === 0) {
      return res.status(404).json({
        message:
          "No time slots found! This room may not be operational at this date.",
      });
    }

    const { open_time, close_time } = hourRows[0];

    const [rows] = await db.query(
      `
      WITH RECURSIVE endTimes AS (
        -- Starting candidate: selectedStart + 1 hour
        SELECT ADDTIME(?, '01:00:00') AS slot
        UNION ALL
        -- Next candidate: add 30 minutes
        SELECT ADDTIME(slot, '00:30:00') AS slot
        FROM endTimes
        WHERE slot < ? -- slot must be less than close_time
      )
      SELECT 
        slot,
        CASE 
          WHEN EXISTS (
            SELECT 1 
            FROM bookings b
            WHERE b.roomID = ?
              AND b.booking_date = ?
              AND b.booking_status IN ('pending', 'confirmed')
              AND (
                TIME_TO_SEC(b.start_time) < TIME_TO_SEC(endTimes.slot)
                AND TIME_TO_SEC(b.end_time) > TIME_TO_SEC(?)
              )
          )
          THEN 'unavailable'
          ELSE 'available'
        END AS status
      FROM endTimes
      ORDER BY slot;
    `,
      [start, close_time, id, date, start]
    );

    console.log(rows);

    // 3) Send the combined result
    const result = {
      id,
      date,
      day: dayName,
      open_time,
      close_time,
      start,
      endSlots: rows,
      success: true,
    };

    console.log(result);

    return res.json(result);
  } catch (error) {
    console.error("Error retrieving end time slots:", error);
    return res.status(500).json({ message: "Failed to fetch time slots(end)" });
  }
});

router.post("/rooms/:id/book", async (req, res, next) => {
  const { id, date, email, startSlot, endSlot } = req.body;
  console.log(
    "[REQ] Get booking request:",
    id,
    date,
    email,
    startSlot,
    endSlot
  );

  // Validate email
  if (!email || !date || !startSlot || !id || !endSlot) {
    return res.status(422).json({
      message: "Booking failed: Missing required booking fields.",
      status: 422,
    });
  }

  try {
    const [rows] = await db.query(
      `
    INSERT INTO bookings (
      user_email,
      roomID,
      booking_date,
      start_time,
      end_time,
      created_at
    )
    SELECT ?, ?, ?, ?, ?, NOW()
    FROM DUAL
    WHERE NOT EXISTS (
      SELECT 1
      FROM bookings
      WHERE booking_date = ?
        AND start_time = ?
        AND end_time = ?
        AND roomID = ?
    )
  `,
      [email, id, date, startSlot, endSlot, date, startSlot, endSlot, id]
    );

    if (rows.affectedRows === 0) {
      return res.status(422).json({
        message:
          "Booking failed: The booking date, " +
          date +
          " from " +
          startSlot +
          " to " +
          endSlot +
          " has already been booked",
        status: 422,
      });
    }

    return res.json({
      message:
        "Successfully booked for " +
        date +
        " from " +
        startSlot +
        " to " +
        endSlot,
      success: true,
    });
  } catch (error) {
    console.error("[!SIGNIN!] Error booking:", error);

    return res.status(500).json({
      message: "User signup failed due to a server error.",
      status: 500,
    });
  }
});

module.exports = router;
