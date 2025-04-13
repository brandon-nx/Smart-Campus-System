const express = require("express");
const db = require("../db");
const router = express.Router();

const { getAll, get, add, replace, remove } = require('../data/event');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

router.get('/', async (req, res, next) => {
  console.log(req.token);
  try {
    const events = await getAll();
    res.json({ events: events });
  } catch (error) {
    next(error);
  }
});

router.get("/event-timetable-sync", async (req, res, next) => {
  console.log("sending request");
  try {
    console.log("Fetching all events for timetable sync");
    const [events] = await db.query("SELECT * FROM event ORDER BY eventstart;");
    return res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    next(error);
  }
});

router.get("/event-sync", async (req,res) => {
  console.log("Get sync one event")
  const data = await db.query("SELECT * FROM event WHERE eventid = ? and eventend >= CURRENT_TIMESTAMP ORDER BY eventstart;",[req.body.id]);
  return res.json({data})
});
router.get("/eventbook", async (req,res) => {
  console.log("Get sync one event")
  const userid = req.body.userid
  const event = req.body.eventid
  const data = await db.query("insert into eventreservations (username,eventid) values (?,?)",[userid,event]);
  return res.json({data})
});

router.get('/:id', async (req, res, next) => {
  try {
    const event = await get(req.params.id);
    res.json({ event: event });
  } catch (error) {
    next(error);
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
