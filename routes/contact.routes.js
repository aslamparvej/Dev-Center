const express = require('express');

const aboutController = require('../controllers/contact.controller');

const router = express.Router();

router.get('/contact', aboutController.getContact);
router.post('/contact', aboutController.postContact);

module.exports = router;