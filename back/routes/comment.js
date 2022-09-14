const express = require("express");
const router = express.Router();
const authorize = require("../others/auth");
const commentController = require("../controllers/comment");
// Routes pour la gestion des commentaires
router.get("/", authorize, commentController.getAllComments);
router.get("/:id", authorize, commentController.getCommentByPostId);
router.post("/", authorize, commentController.addComment);
router.delete("/:id", authorize, commentController.deleteComment);
router.delete("/post/:id", authorize, commentController.deleteCommentByPostId);
router.delete("/user/:id", authorize, commentController.deleteCommentsByUserId);

module.exports = router;
