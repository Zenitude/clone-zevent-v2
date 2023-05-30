const express = require("express");
const { shopRender } = require("../controllers/shop_controller");

const router = express.Router();

router.get("/shop", shopRender);

module.exports = router;