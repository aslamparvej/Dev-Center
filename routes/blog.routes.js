const express = require('express');

const blogController = require('../controllers/blog.controller');

const router = express.Router();

router.get('/blog', blogController.getBlog);
router.get('/blog/:slug', blogController.getBlogPost);

module.exports = router;