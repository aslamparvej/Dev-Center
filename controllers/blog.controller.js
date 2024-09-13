const Post = require('../models/post.model');

async function getBlog(req, res) {
    try {
        const blogs = await Post.find().populate('category').populate('userId');

        res.render('user/blogs/blogs', {blogs: blogs});
    } catch (error) {
        res.json({Meassge: error});
    }
    
}

async function getBlogPost(req, res){
    try {
        const blogId = req.params.id;

        const blogPost = await Post.findById(blogId).populate('category').populate('userId');

        res.render('user/blogs/blog', {blogPost: blogPost});

        // res.json(blogPost);

    } catch (error) {
        res.json({Meassge: error});
    }
}

module.exports = {
    getBlog: getBlog,
    getBlogPost: getBlogPost
  }