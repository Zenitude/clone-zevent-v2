const express = require('express');
const { associationsRender } = require('../controllers/associations_controller');

const router = express.Router();

router.get('/associations', associationsRender);

module.exports = router;