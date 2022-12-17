const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const {
	getComments,
    getComment,
    postComment,
    deleteComment,
    updateComment,
} = require("../controllers/commentsController");

const router = express.Router();

router.use(requireAuth);

router.get("/:id", getComment);

router.get("/", getComments);

router.post("/", postComment);

router.delete("/:id", deleteComment);

router.patch("/:id", updateComment);

module.exports = router;