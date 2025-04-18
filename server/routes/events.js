const express = require("express");
const db = require("../db");
const router = express.Router();


const { getAll, get, add, replace, remove } = require('../data/event');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');





router.get('/categories', async (req, res, next) => {
  try {
    const [event] = await db.query("SELECT * FROM event_type");
    return res.json( event );
  } catch (error) {
    console.log(error);
  }
});
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
router.get("/eventcategories", async (req, res) => {
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
// router.use(checkAuth);

router.post('/', async (req, res, next) => {
  console.log(req.token);
  const data = req.body;

  let errors = {};

  if (!isValidText(data.title)) {
    errors.title = 'Invalid title.';
  }

  if (!isValidText(data.description)) {
    errors.description = 'Invalid description.';
  }

  if (!isValidDate(data.date)) {
    errors.date = 'Invalid date.';
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = 'Invalid image.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'Adding the event failed due to validation errors.',
      errors,
    });
  }

  try {
    await add(data);
    res.status(201).json({ message: 'Event saved.', event: data });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  const data = req.body;

  let errors = {};

  if (!isValidText(data.title)) {
    errors.title = 'Invalid title.';
  }

  if (!isValidText(data.description)) {
    errors.description = 'Invalid description.';
  }

  if (!isValidDate(data.date)) {
    errors.date = 'Invalid date.';
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = 'Invalid image.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'Updating the event failed due to validation errors.',
      errors,
    });
  }

  try {
    await replace(req.params.id, data);
    res.json({ message: 'Event updated.', event: data });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await remove(req.params.id);
    res.json({ message: 'Event deleted.' });
  } catch (error) {
    next(error);
  }
});



module.exports = router;
