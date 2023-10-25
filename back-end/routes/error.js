const express = require("express");
const router = express.Router();
const path = require('path');

router.use((req, res, next) => {
    const title = 'ZEvent 2022 - Du 9 au 11 septembre 2022'
    res.status(200).render(path.join(__dirname, '../views/error.ejs'), { title});
});

module.exports = router;