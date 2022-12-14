const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addComment = async (req, res, next) => {
  try {
    const { postId, authorId, textContent, date } = req.body;
    const Comment = await prisma.comments
      .create({
        data: {
          postId,
          authorId,
          textContent,
          date,
        },
      })
      .then(res.status(200).json({ message: "Comment created by addComment" }))
      .catch((e) => res.status(500).json({ e }));
  } catch {
    (e) => res.status(501).json({ e });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const getAllComs = await prisma.comments
      .findMany({
        orderBy: {
          date: "desc",
        },
      })
      .then((data) => res.status(200).json(data))
      .catch(res.status(500).json(e));
  } catch {
    (e) => res.status(500).json(e);
  }
};

exports.getCommentByPostId = async (req, res) => {
  try {
    const getComs = await prisma.comments
      .findMany({
        where: {
          postId: parseInt(req.params.id),
        },
        orderBy: {
          date: "desc",
        },
      })
      .then((data) => res.status(200).json(data))
      .catch(res.status(500).json(e));
  } catch {
    (e) => res.status(500).json(e);
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const delCom = await prisma.comments
      .delete({
        where: {
          comId: parseInt(req.params.id),
        },
      })
      .then(res.status(200).json({ message: "Comment deleted by deleteComment" }))
      .catch(res.status(500).json(e));
  } catch {
    (e) => res.status(500).json(e);
  }
};

exports.deleteCommentByPostId = async (req, res) => {
  try {
    const delCom = await prisma.comments
      .deleteMany({
        where: {
          postId: parseInt(req.params.id),
        },
      })
      .then(res.status(200).json({ message: "Comment deleted by deleteCommentByPostId" }))
      .catch(res.status(500).json(e));
  } catch {
    (e) => res.status(500).json(e);
  }
};

exports.deleteCommentsByUserId = async (req, res) => {
  try {
    const delComs = await prisma.comments
      .deleteMany({
        where: {
          authorId: parseInt(req.params.id),
        },
      })
      .then(res.status(200).json({ message: "Comments deleted by deleteCommentsByUserId" }))
      .catch(res.status(500).json(e));
  } catch {
    (e) => res.status(500).json(e);
  }
};
