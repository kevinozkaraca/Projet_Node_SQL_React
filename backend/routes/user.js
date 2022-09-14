const express = require("express");
const router = express.Router();
const authorize = require("../others/auth");
const multer = require("../others/multer");
const userController = require("../controllers/user");
// Routes pour l'affichage des utilisateurs
router.get("/", authorize, userController.getAllUsers);
router.get("/:id", authorize, userController.getUser);
router.patch("/updateProfile/:userId", authorize, multer.single("imageUrl"), userController.updateProfile);
router.delete("/:id", authorize, userController.deleteProfile);

module.exports = router;
