const express = require('express');
const authController = require('../controllers/auth.controller');
const User = require("../models/user.model");


const router = express.Router();

// Signup Routes
router.get('/signup', authController.getSignup);
// router.post('/signup', authController.signup);

// Login Routes
router.get('/login', authController.getLogin);
router.post('/login', authController.login);

// Login Routes
router.post('/logout', authController.logout);

// For GET User Route
router.get('/user', async (req, res) => {
    try {
        const users = await User.find();

        res.json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});



module.exports = router;