<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware); // all routes below are protected

router.post("/", postController.createPost);
router.get("/", postController.getMyPosts);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);
=======
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware); // all routes below are protected

router.post('/', postController.createPost);
router.get('/', postController.getMyPosts);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
>>>>>>> 5f791244dbeaa3940d29d5ba8677264147580d03

module.exports = router;
