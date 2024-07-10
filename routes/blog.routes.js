const express = require('express');

const blogController = require('../controllers/blog.controller');

const router = express.Router();

router.get('/blog', blogController.getBlog);

module.exports = router;