const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const db = require('../data/database');

/* *********** Sign up controller :: Begins *********** */
function getSignup(req,res){
  res.render("user/auth/signup");
}

async function signup(req, res){

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const user = {
    'name': req.body.email,
    'email': req.body.fname,
    'password': hashedPassword,
    'userType': req.body.userType,
  }

  await db.connectToDatabase();
  // const database = db.getDb();
  // database.collection('users');
  await db.getDb().collection("users").insertOne(user);
  console.log(user);

  
  res.redirect('/login');
}

/* *********** Sign up controller :: Ends *********** */


function getLogin(req,res){
  res.render("user/auth/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
}