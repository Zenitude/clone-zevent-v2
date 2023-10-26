const express = require("express");
const { sendProducts } = require("../controllers/shop_controller");
const router = express.Router();
const path = require('path');

router.get("/products-list", sendProducts);


module.exports = router;