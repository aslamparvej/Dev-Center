const express = require('express');

const adminController = require('../controllers/admin.controller');

const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', adminController.getDashboard);

router.get('/categories', adminController.getCategory);
router.post('/categories', adminController.addNewCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

router.get('/create-blog', adminController.getNewBlog);
router.post('/create-blog', upload.single('blogFeaturedImage'), adminController.addNewBlog);

router.get('/blogs', adminController.getAllBlog);
router.delete('/blogs/:id', adminController.deleteBlog);

router.get('/users', adminController.getUsers);
router.post('/users', adminController.addUser);
router.delete('/users/:id', adminController.deleteUser);



module.exports = router;