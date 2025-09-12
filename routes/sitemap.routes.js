const express = require('express');

const router = express.Router();

router.get('/privacy-policy', function(req, res){
    res.render("user/legal/privacy-policy");
});

router.get('/terms-and-conditions', function(req, res){
    res.render("user/legal/terms-and-conditions");
});

router.get('/disclaimer', function(req, res){
    res.render("user/legal/disclaimer");
});

router.get('/cookie-policy', function(req, res){
    res.render("user/legal/cookie-policy");
});

router.get('/sitemap', function(req, res){
    res.render("user/legal/sitemap");
});


module.exports = router;