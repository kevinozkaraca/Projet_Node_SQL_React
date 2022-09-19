const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const tokenRecupere = req.headers.authorization.split(" ")[1];
    // 123 est le code du token (a mettre dans le .env)
    const decodedToken = jwt.verify(tokenRecupere, "123");
    const userId = decodedToken.id;
    if (req.body.userId && req.body.userId !== userId) {
      throw res.status(403).json({ message: "UserId is not correct (Jwt)." });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: "Authentification failed (Jwt)." });
  }
};
