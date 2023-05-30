const express = require("express");
const { homeRender } = require("../controllers/home_controller");

const router = express.Router();

router.get("/", homeRender);

module.exports = router;