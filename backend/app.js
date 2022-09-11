// dépendances et foncitonnalités node.js
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

// Routes
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");

app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
  res.send("Hello Man");
});

// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);

module.exports = app;
