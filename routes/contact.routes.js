const express = require('express');

const aboutController = require('../controllers/contact.controller');

const router = express.Router();

router.get('/contact', aboutController.getContact);

module.exports = router;