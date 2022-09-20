// dépendances et foncitonnalités node.js
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

// Fichiers des routes
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const commentRouter = require("./routes/comment");
const likeRouter = require("./routes/like");
const postRouter = require("./routes/post");
app.use(express.json());
app.use(cors());

// Test
app.get("/", function (req, res) {
  res.send("Hello Man");
});

// Liens des routes
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);
app.use("/api/likes", likeRouter);

module.exports = app;
