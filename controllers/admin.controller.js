const Category = require('../models/category.model');
const Post = require('../models/post.model');

function getDashboard(req, res) {
    res.render("admin/home/home");
}


/* Blog Post Controller :: Begins */
async function getNewBlog(req, res) {
    try {
        const categories = await Category.find();
        res.render("admin/blog/create-blog", { categories: categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getAllBlog(req, res) {
    try {
        const blogs = await Post.find().populate('category').populate('userId');

        // res.json(blogs);
        res.render("admin/blog/all-blog", {blogs: blogs});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function addNewBlog(req, res) {
    try {

        const newPost = new Post({
            title: req.body.blogTitle,
            description: req.body.blogDescription,
            featuredImage: req.file ? `/uploads/${req.file.filename}` : '',
            blogText: req.body.blogContent,
            userId: req.user.id,
            category: req.body.blogCategory
        });

        await newPost.save();

        res.redirect('/admin/blogs');

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deleteBlog(req, res) {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // await category.remove();
        res.redirect('/admin/blogs');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
/* Blog Post Controller :: Ends */



/* Categoies Controller :: Begins */
async function getCategory(req, res) {
    try {
        const categories = await Category.find();

        res.render("admin/category/category", { categories: categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

async function addNewCategory(req, res) {

    const category = new Category({
        category: req.body.category
    });

    try {
        const newCategory = await category.save();
        res.redirect('/admin/categories');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function updateCategory(req, res) {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        category.category = req.body.category;
        await category.save();
        res.redirect('/admin/categories');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

}

async function deleteCategory(req, res) {
    try {
        // const category = await Category.findById(req.params.id);
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        // await category.remove();
        res.redirect('/admin/categories');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
/* Categoies Controller :: Ends */


module.exports = {
    getDashboard: getDashboard,
    getNewBlog: getNewBlog,
    getAllBlog: getAllBlog,
    addNewBlog: addNewBlog,
    getCategory: getCategory,
    addNewCategory: addNewCategory,
    updateCategory: updateCategory,
    deleteCategory: deleteCategory,
    deleteBlog: deleteBlog,
}