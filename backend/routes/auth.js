// dépendances et foncitonnalités node.js
const express = require("express");
const router = express.Router();
// Fichiers externes
const passwordValidator = require("../others/passwordValidator");
const userController = require("../controllers/user");
// Routes pour l'inscription et la validation
router.post("/signup", passwordValidator, userController.signup);
router.post("/login", userController.login);

module.exports = router;
