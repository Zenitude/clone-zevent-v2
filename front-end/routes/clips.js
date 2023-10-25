const express = require("express");
const router = express.Router();
const path = require('path');

router.get("/clips", (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../views/clips.html'));
});

module.exports = router;