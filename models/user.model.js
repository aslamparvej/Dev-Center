const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['Admin', 'Contributor', 'User'],
    required: true,
  }
}, {timestamps: true});


module.export = mongoose.model('User', userSchema);

// Updated on 14-03-20224
/* const bcrypt = require('bcryptjs');

const db = require('../data/database');

class User {
  constructor(email, fullName, password, userType){
    this.email = email;
    this.name = fullName;
    this.password = password;
    this.userType =  userType;
  }
  async signup(){
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDb().collection('users').insertOne({
      email: this.email,
      name: this.name,
      password: hashedPassword,
      userType: this.userType
    });
  }
} */