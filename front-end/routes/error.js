const express = require("express");
const router = express.Router();
const path = require('path');

router.use((req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../views/error.html'));
});

module.exports = router;