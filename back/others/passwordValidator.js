const passCheck = require("../models/password");

module.exports = (req, res, next) => {
  if (passCheck.validate(req.body.password)) {
    return next();
  } else {
    return res.status(200).json({ message: "invalidPassword" });
  }
};
