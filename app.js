const express = require('express');
const path = require('path');

const authRoute = require('./routes/auth.routes');
const homeRoute = require('./routes/home.routes');

const app = express();

// Constant Variables
const PORT = 3000;
const URL = 'localhost://';

// Tells the express which view engine we used
app.set("view engine", "ejs");
// Tells the express, ejs folder
app.set("views", path.join(__dirname, "views"));

// for static pages e.g. CSS files
app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));

// For router
app.use(authRoute);
app.use(homeRoute)

app.listen(PORT, function(){
  console.log(`Server running on PORT ${PORT}`);
  console.log(`You can see the site on link ${URL}${PORT}`);
});