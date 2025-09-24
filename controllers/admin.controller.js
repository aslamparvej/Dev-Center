const Category = require('../models/category.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const {generateBlogFromTopic} = require('../services/aiBlogService');



function getGreeting() {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 5 && hours < 12) {
        return "Good Morning";
    } else if (hours >= 12 && hours < 17) {
        return "Good Afternoon";
    } else if (hours >= 17 && hours < 21) {
        return "Good Evening";
    } else {
        return "Good Night";
    }
}

function checkCount(count) {
    return count < 10 ? "0" + count : count;
}

async function getDashboard(req, res) {
    const user = await User.findById(req.userId);
    const blogs = await Post.find().populate('userId').sort({ createdAt: -1 }).limit(6);

    let postCount = await Post.countDocuments();
    let userCount = await User.countDocuments();
    let categoryCount = await Category.countDocuments();



    let count = {
        postCount: checkCount(postCount),
        userCount: checkCount(userCount),
        categoryCount: checkCount(categoryCount),
    }

    // Checking time
    const greeting = getGreeting()
    res.render("admin/home/home", { user: user, greeting: greeting, count: count,  blogs: blogs});
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
        const blogs = await Post.find().populate('userId');

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

function getGenerateAiBlog(req, res) {
    res.render("admin/blog/generate-ai-blog");
}

async function postGenerateAiBlog(req, res) {
    try {
        const { topic } = req.body;
        if (!topic) return res.status(400).send("Topic is required");

        // avoid accidental duplicates by topic hash
        const draft = await generateBlogFromTopic(topic);
        

        // ensure unique slug
        let finalSlug = draft.slug;
        let i = 2;
        while (await Post.findOne({ slug: finalSlug })) {
            finalSlug = `${draft.slug}-${i++}`;
        }
        draft.slug = finalSlug;

        const existingHash = await Post.findOne({ topicHash: draft.topicHash });
        if (existingHash) {
            return res.status(409).send("Looks like you already generated a post for a very similar topic.");
        }

        const saved = await Post.create(draft);
        // res.redirect(`/blogs/${saved.slug}`);
        res.redirect(`./blogs`);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function addUser(req, res) {

    const { name, email, password, confirmPassword, userType } = req.body;


    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const newUser = new User({ username: email, name, email, password: hashedPassword, userType: userType });

        const newUserVal = await newUser.save();
        console.log(newUserVal);

        const mainOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `New User Created`,
            html: `<div class="mail-template-container" style="height: 100%; width: 100%; background: #EAF0F3; font-family: Arial; color: #5E5E5E; font-size: 16px;font-weight: 400;line-height: 26px;">
            <div class="mail-template" style="width: 40rem; margin: 0 auto; height: 100%; padding: 1rem;">
            <div class="client-logo-container" style="margin-bottom: 2rem;">
            <img src="https://devcenter.in/img/assets/website-logo.png" alt="enerv global logo" />
            </div>
            <div class="mail-content" style="background: #FFFFFF; padding: 2rem;">
                <div class="mail-content-header" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <img src="./assets/verified-icon.png" alt="verified icon" style="display: none" />
                    <p>Dear <span style="color: #000000;">${name}</span>,</p>
                </div>
                <div class="mail-content-body">
                    <p>Your login is created in Dev Center</p>
                    <p>Login: ${email}</p>
                    <p>Password: ${password}</p>
                    <p><a href="https://devcenter.in/login">Please login here</a></p>
                </div>
                <div class="mail-content-footer" style="margin-top: 1rem;">
                    <p>Thanks</p>
                    <p style="color: #000000;">
                        Dev Center Administrator
                    </p>
                </div>
            </div>
            <div class="footer-container" style="margin-top: 1rem;">
                <p style="color: #595959; width: 85%;margin: 0 auto;text-align: center;">You have received this email because one user has been created for you in Dev Center Admin Portal For help contact <span style="color: #006838;">support@devcenter.in</span>.</p>
            </div>
        </div>
    </div>`
        }

        transporter.sendMail(mainOptions, (error, info) => {
            if (error) {
                return res.render('user/includes/alert', { title: "User creation send mail failed", message: "There was an error processing your request. Please try again later.", icon: "error", confirmButtonText: "Ok", redirectLocation: "/admin/users" });
            } else {
                res.render('user/includes/alert', { title: "User Created", message: "Successfully created user.", icon: "success", confirmButtonText: "Ok", redirectLocation: "/admin/users" });
            }
        });
    } catch (error) {
        return res.render('user/includes/alert', { title: "User creation failed", message: `There was an error processing your request. Please try again later. ${error}`, icon: "error", confirmButtonText: "Ok", redirectLocation: "/admin/users" });
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
    deleteUser: deleteUser,
    getGenerateAiBlog: getGenerateAiBlog,
    postGenerateAiBlog: postGenerateAiBlog
}