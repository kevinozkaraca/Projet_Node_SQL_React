const { PrismaClient } = require("@prisma/client");
const Prisma = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const prisma = new PrismaClient();

exports.signup = async (req, res, next) => {
  if (!verifNames(req.body.userName)) res.status(200).json({ message: "badInputuserName" });
  else if (!verifMail(req.body.email)) res.status(200).json({ message: "badInputMail" });
  else {
    try {
      const salt = bcrypt.genSaltSync(14);
      const passwordHashed = bcrypt.hashSync(req.body.password, salt);

      const User = await prisma.user
        .create({
          data: {
            username: req.body.username,
            email: req.body.email,
            password: passwordHashed,
            imageUrl: "http://localhost:3005/images/default.png",
          },
        })
        .then((data) => {
          const token = createToken(data.userId);
          res.status(201).json({ message: "success", user: data.userId, token: token });
        })
        .catch((e) => {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
              console.log("There is a unique constraint violation, a new user cannot be created with this email");
              res.status(200).json({ message: "exists" });
            }
          }
          throw e;
        });
    } catch {
      (error) => res.status(500).json({ error });
    }
  }
};

const createToken = (id) => {
  // 123 est le code du token à mettre dans le .env
  return jwt.sign({ id }, "123", { expiresIn: "24h" });
};

exports.login = async (req, res, next) => {
  const user = await prisma.user
    .findUnique({
      where: {
        email: req.body.email,
      },
    })
    .then((userData) => {
      if (!userData) {
        return res.status(200).json({ message: "unknown" });
      }
      bcrypt
        .compare(req.body.password, userData.password)
        .then((valid) => {
          if (!valid) {
            return res.status(200).json({ message: "password not correct" });
          }
          const token = createToken(userData.userId);
          console.log("token created " + token);
          res.status(200).json({ currentUser: userData.userId, token: token });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.updateProfile = async (req, res, next) => {
  let userProfile = null;

  if (req.file) {
    if (req.body.password) {
      userProfile = {
        email: req.body.email,
        password: crypting(req.body.password),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      };
    } else {
      userProfile = {
        email: req.body.email,

        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      };
    }
  } else if (req.body.password) {
    userProfile = {
      email: req.body.email,

      password: crypting(req.body.password),
      companyFunction: req.body.bio,
    };
  } else {
    userProfile = {
      email: req.body.email,
      companyFunction: req.body.bio,
    };
  }

  if (req.file) {
    const findOldImg = await prisma.user
      .findUnique({
        where: {
          userId: parseInt(req.params.userId),
        },
      })
      .then((data) => {
        if (data.imageUrl !== "http://localhost:3005/images/default.png") {
          const fileToDelete = data.imageUrl.split("/images/")[1];
          fs.unlink(`images/${fileToDelete}`, () => {
            console.log("Ancienne image supprimée.");
          });
        }
      })
      .catch((e) => res.status(500).json({ message: "Error in findOldImg" }));
  }

  const updateUser = await prisma.user
    .update({
      where: {
        userId: parseInt(req.params.userId),
      },
      data: userProfile,
    })
    .then(() => res.status(200).json({ message: "User created" }))
    .catch((e) => res.status(500).json({ message: "Error in updateUser", e }));
};

exports.deleteProfile = async (req, res, next) => {
  const user = await prisma.user
    .findUnique({
      where: {
        userId: parseInt(req.params.id),
      },
    })
    .then((data) => {
      if (data.imageUrl && data.imageUrl !== "http://localhost:3005/images/default.png" && data.imageUrl !== "noPic") {
        const fileToDelete = data.imageUrl.split("/images")[1];
        fs.unlink(`images/${fileToDelete}`, () => {
          console.log("Avatar supprimé");
        });
      }
    })
    .catch((e) => console.log("Error in deleteProfile : " + e));
  const deleteProfile = await prisma.user
    .delete({
      where: {
        userId: parseInt(req.params.id),
      },
    })
    .then(() => res.status(200).json({ message: "Deleted by deleteProfile !" }))
    .catch((e) => res.status(500).json({ message: "Error in deleteProfile" }));
};

exports.getAllUsers = async (req, res, next) => {
  const getAllUsers = await prisma.user
    .findMany()
    .then((users) => res.status(200).json(users))
    .catch((e) => res.status(500).json({ message: "Request error in getAllUsers" }));
};

exports.getUser = async (req, res, next) => {
  const getUser = await prisma.user
    .findUnique({
      where: {
        userId: parseInt(req.params.id),
      },
    })
    .then((user) => {
      if (user) res.status(200).json(user);
      else res.status(404).json({ message: "Username not found (getUser)" });
    })
    .catch(() => res.status(500).json({ message: "Request error getUser" }));
};

function crypting(password) {
  try {
    const salt = bcrypt.genSaltSync(14);
    return bcrypt.hashSync(password, salt);
  } catch {
    (e) => console.log("Error in crypting function crypting : " + e);
  }
}
// Conditions pour la nom d'utilisateur
function verifNames(n) {
  return /^[^@&"()!_$*€£`+=\/;?#\d]+$/.test(n);
}
// Conditions pour l'adresse mail
function verifMail(adresse) {
  return /^([A-Za-z]|[0-9])/.test(adresse);
}
