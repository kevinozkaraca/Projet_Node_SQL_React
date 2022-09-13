const express = require("express");
const router = express.Router();
const authorize = require("../others/auth");
const postController = require("../controllers/post");
const multer = require("../others/multer");

router.get("/", authorize, postController.getAllPosts);
router.get("/:authorId/:date", postController.getPost);
router.get("/:id", authorize, postController.getPostsByUser);
router.post("/", authorize, multer.single("imgContent"), postController.addPost);
router.patch("/:id", authorize, multer.single("imgContent"), postController.updatePost);
router.delete("/:id", authorize, postController.deletePost);

module.exports = router;
