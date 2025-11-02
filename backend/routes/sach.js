var express = require("express");
var router = express.Router();
var db = require("./../models/database");

/* Get */

router.get("/", async function (req, res) {
  const database = await db();

  const sach = database.collection("sach");
  const sachResult = await sach.find({}).toArray();

  res.json(sachResult);
});

/* Get id */
router.get("/:id", async function (req, res) {
  const database = await db();

  const sach = database.collection("sach");
  const checkidsach = { id: parseInt(req.params.id) };
  const sachResult = await sach.find(checkidsach).toArray();

  res.json(sachResult);
});

module.exports = router;
