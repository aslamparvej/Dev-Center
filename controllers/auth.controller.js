const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const db = require('../data/database');

/* *********** Sign up controller :: Begins *********** */
function getSignup(req,res){
  res.render("user/auth/signup");
}

async function signup(req, res){
  const { name, email, password, confirmPassword, userType } = req.body;

    try {
        // Check if user already exists
        // let existingUser = await User.findOne({ email });
        // if (existingUser) {
        //     return res.status(400).json({ message: 'User already exists' });
        // }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const newUser = new User({username: email, name, email, password: hashedPassword, userType: "Admin"});
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

  /* const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const user = {
    'name': req.body.email,
    'email': req.body.fname,
    'password': hashedPassword,
    'userType': req.body.userType,
  }


  const database = db();

  await database.collection("users").insertOne(user);
  
  console.log(user);

  
  res.redirect('/login'); */
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