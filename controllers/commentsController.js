const Comment = require("../models/commentsModel");
const mongoose = require("mongoose");

// GET Comments

const getComments = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const comment = await Comment.find({"listing._id": id}).sort({ createdAt: -1 });
        if (!comment) {
            return res.status(404).json({ error: "No comments found" });
        }
        res.status(200).json({ data: comment });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

// POST Comment

const postComment = async (req, res) => {
    // get data about comment

    let { text, user, listing } = req.body

    // requested field handling
    if (text.trim() === '') {
        return res.status(400).json({ error: "Cannot post an empty comment" });
    }

    try {
        const comment = await Comment.create({ text, likes: [], replies: [], listing, user: {_id: user._id, username: user.username} });
        res.status(200).json({ data: comment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE Comment

const updateComment = async (req, res) => {
    const { id } = req.params;
    const { likes, replies, text } = req.body;

    // check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        let comment = await Comment.findById({ _id: id });

        if (!comment) {
            return res.status(404).json({ error: "No comment found" });
        }

        // Handle text updates

        // check if text is empty string
        if (typeof text === "string") {

            // user can only update the text of his own comment
            if (!req.user._id.equals(comment.user._id)) {
                return res.status(401).json({ error: "Unauthorized access" });
            }

            if (req.body.text.trim().length === 0) {
                return res.status(400).json({ error: "Comment text cannot be empty string" });
            }
            await Comment.findByIdAndUpdate({ _id: id }, { text: req.body.text })
        }

        // Handle likes

         // if request includes a likes update, check if the user has already liked this comment, if yes, remove the like
        if (likes) {
            const userLiked = await Comment.findOne({_id: id, "likes._id": req.user._id});

            if (userLiked) {
                await Comment.findByIdAndUpdate({ _id: id }, { $pull: { likes: { _id: req.user._id  } } })
            } else {
                await Comment.findByIdAndUpdate({ _id: id }, { $push: { likes: req.user } })
            }
        }

        // Handle replies

        if (replies) {
            await Comment.findByIdAndUpdate({ _id: id }, { $push: { replies: req.body.replies } })
        }
        
        res.status(200).json({ data: comment });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE Comment

const deleteComment = async (req, res) => {
    const { id } = req.params;

    // check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const comment = await Comment.findById({ _id: id });

        if (!comment) {
            return res.status(404).json({ error: "No comment found" });
        }

        // user can only delete his own comments
        if (!req.user._id.equals(comment.user._id)) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        await Comment.findByIdAndDelete({ _id: id });
        res.status(200).json({ data: comment });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getComments,
    postComment,
    updateComment,
    deleteComment
};