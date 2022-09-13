const express = require("express");
const router = express.Router();
const authorize = require("../others/auth");
const likesController = require("../controllers/likes");

router.get("/", authorize, likesController.getLikes);
router.delete("/deleteLike/:postId/:userId", authorize, likesController.deleteLike);
router.delete("/:id", authorize, likesController.deleteLikeByPostId);
router.delete("/user/:id", authorize, likesController.deleteLikeByUserId);
router.post("/:postId/:userId", authorize, likesController.addLike);

module.exports = router;
