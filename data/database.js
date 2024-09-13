const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

function mongoDBConnection() {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch(error => {
            console.error('Database connection error:', error);
        })
}

module.exports = {
    mongoDBConnection: mongoDBConnection,
}