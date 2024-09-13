const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const moment = require('moment');

require('dotenv').config();

const database = require('./data/database');

const authRoute = require('./routes/auth.routes');
const homeRoute = require('./routes/home.routes');
const blogRoute = require('./routes/blog.routes');
const videoRoute = require('./routes/video.routes');
const aboutRoute = require('./routes/about.routes');
const contactRoute = require('./routes/contact.routes');
const adminRoute = require('./routes/admin-routes');

const authenticateToken = require('./middleware/verifyJWT');
const authStatus = require('./middleware/setAuthStatus');


const app = express();

// Constant Variables
let PORT = 3000;
let URL = 'localhost:';

if(process.env.PORT){
  PORT = process.env.PORT;
}
if(process.env.URL){
  URL = process.env.URL;
}

// Tells the express which view engine we used
app.set("view engine", "ejs");
// Tells the express, ejs folder
app.set("views", path.join(__dirname, "views"));

app.locals.moment = moment;

app.use(express.json());
app.use(cookieParser());
app.use(authStatus);
app.use(methodOverride('_method'));

// for static pages e.g. CSS files
app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));


// For router
app.use(authRoute);
app.use(homeRoute);
app.use(blogRoute);
app.use(videoRoute);
app.use(contactRoute);
app.use(aboutRoute);
app.use('/admin', authenticateToken , adminRoute);


app.listen(PORT, function(){
  console.log(`Server running on PORT ${PORT}`);
  console.log(`You can see the site on link ${URL}${PORT}`);

  database.mongoDBConnection();
});