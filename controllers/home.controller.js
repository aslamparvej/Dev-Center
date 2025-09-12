const User = require('../models/user.model');
const Post = require('../models/post.model');

async function getHome(req, res) {
  try {
    const blogs = await Post.find().populate('userId').sort({ createdAt: -1 });

    res.render("user/home/home", { blogs: blogs });
  } catch (error) {
    res.json({ Meassge: error });
  }
}

async function subscribe(req, res){
  try {
    const subscribeEMail = req.body.email;

    res.render('user/includes/alert', {title:"Thank You", message: "We are grateful for your subscription to our newsletter.", icon: "success", confirmButtonText: "Ok", redirectLocation: "/" });
  } catch (error) {
    res.json({ Meassge: error });
  }
}


module.exports = {
  getHome: getHome,
  subscribe: subscribe,
}