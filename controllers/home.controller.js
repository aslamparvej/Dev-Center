const User = require('../models/user.model');


function getHome(req,res){
  res.render("user/home/home");
}




module.exports = {
  getHome: getHome,
}