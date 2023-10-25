const express = require("express");
const router = express.Router();
const path = require('path');

router.get("/associations", (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../views/associations.html'));
});

module.exports = router;