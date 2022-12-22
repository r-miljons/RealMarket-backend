const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const {
    getComments,
    postComment,
    deleteComment,
    updateComment,
} = require("../controllers/commentsController");

const router = express.Router();

router.get("/:id", getComments);

router.post("/", requireAuth, postComment);

router.delete("/:id", requireAuth, deleteComment);

router.patch("/:id", requireAuth, updateComment);

module.exports = router;