const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const db = require('../data/database');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

/* *********** Sign up controller :: Begins *********** */
function getSignup(req, res) {
  res.render("user/auth/signup");
}

async function signup(req, res) {

  const { name, email, password, confirmPassword, userType } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({ username: email, name, email, password: hashedPassword, userType: "Admin" });
    console.log(newUser);
    const newUserVal = await newUser.save();

    res.status(201).json({ message: 'User created successfully', newUserVal: newUserVal });
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}
/* *********** Sign up controller :: Ends *********** */

/* *********** Login controller :: Begins *********** */
function getLogin(req, res) {
  res.render("user/auth/login");
}

async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }


    const isMatch = await user.comparePassword(req.body.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Password not matched' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });

    // Redirect to the admin page
    res.redirect('/admin');

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
/* *********** Login controller :: Ends *********** */

/* *********** Logout controller :: Begins *********** */
function logout(req, res) {
  // Clear the token cookie
  res.clearCookie('token');

  res.redirect('/login');
}
/* *********** Logout controller :: Ends *********** */

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
}