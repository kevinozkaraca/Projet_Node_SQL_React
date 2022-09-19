const passwordValidator = require("password-validator");

const passSchema = new passwordValidator();
// conditions pour la validation du mot de passe
passSchema.is().min(5).is().max(20).has();

module.exports = ("PassCheck", passSchema);
