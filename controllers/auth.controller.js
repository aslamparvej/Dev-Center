function getSignup(req,res){
  res.render("user/auth/signup");
}
function getLogin(req,res){
  res.render("user/auth/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
}