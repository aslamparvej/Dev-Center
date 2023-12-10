const bcrypt = require('bcryptjs');

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
}