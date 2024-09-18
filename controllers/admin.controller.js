const Category = require('../models/category.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

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
        res.render("admin/blog/all-blog", { blogs: blogs });
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

/* Users or Contributor Controller :: Begins */
async function getUsers(req, res) {
    try {
        const users = await User.find();

        res.render("admin/user/users", { users: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function addUser(req, res) {

    const { name, email, password, confirmPassword, userType } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const newUser = new User({ username: email, name, email, password: hashedPassword, userType: userType });
        // console.log(newUser);
        const newUserVal = await newUser.save();

        res.render('user/includes/alert', { title: "User Created", message: "Successfully created users.", icon: "success", confirmButtonText: "Ok", redirectLocation: "/admin/users" });
        // res.status(201).json({ message: 'User created successfully',  newUserVal: newUserVal});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}



async function deleteUser(req, res) {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.redirect('/admin/users');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
/* Users or Contributor Controller :: Ends */

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
    getUsers: getUsers,
    addUser: addUser,
    deleteUser: deleteUser
}