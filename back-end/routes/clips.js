const express = require("express");
const { clipsRender } = require("../controllers/clips_controller");

const router = express.Router();

router.get("/clips", clipsRender);

module.exports = router;