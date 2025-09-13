const Post = require('../models/post.model');

async function getBlog(req, res) {
    try {
        const blogs = await Post.find().populate('userId').sort({ createdAt: -1 });

        res.render('user/blogs/blogs', { blogs: blogs });
    } catch (error) {
        res.json({ Meassge: error });
    }

}

async function getBlogPost(req, res) {
    try {


        const blogPost = await Post.findOne({ slug: req.params.slug, status: "published" });
        if (!blogPost) return res.status(404).send("Not found");
        
        // res.render("blog-show", { blog });
        // const blogId = req.params.id;
        // const blogPost = await Post.findById(blogId).populate('userId');

        res.render('user/blogs/blog', { blogPost: blogPost });

    } catch (error) {
        res.json({ Meassge: error });
    }
}

module.exports = {
    getBlog: getBlog,
    getBlogPost: getBlogPost
}