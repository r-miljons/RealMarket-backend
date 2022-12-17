const Comment = require("../models/commentsModel");
const mongoose = require("mongoose");

// GET Comments

const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({});
        res.status(200).json({ data: comments });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

// GET Comment

const getComment = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const comment = await c.findOne({_id: id});
        if (!comment) {
            return res.status(404).json({ error: "No comment found" });
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
    const emptyFields = [];

    if (!text) {
        emptyFields.push("Text");
    }
    if (!user) {
        emptyFields.push("User");
    }
    if (!listing) {
        emptyFields.push("Listing");
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: "Please provide the fields: " + emptyFields.join(", ") });
    }

    try {
        const comment = await Comment.create({ text, likes: [], replies: [], listing, user: req.user });
        res.status(200).json({ data: comment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE Comment

const updateComment = async (req, res) => {
    const { id } = req.params;

    // check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        let comment = await Comment.findById({ _id: id });

        if (!comment) {
            return res.status(404).json({ error: "No comment found" });
        }

        // user can only update his own comment
        if (!req.user._id.equals(comment.user._id)) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        // Handle text updates

        // check if text is empty string
        if (typeof req.body.text === "string") {
            if (req.body.text.trim().length === 0) {
                return res.status(400).json({ error: "Comment text cannot be empty string" });
            }
            await Comment.findByIdAndUpdate({ _id: id }, { text: req.body.text })
        }

        // Handle likes

         // if request includes a likes update, check if the user has already liked this comment, if yes, remove the like
        if (req.body.likes) {
            comment.likes.find(user => req.user._id.equals(user._id)) && await Comment.findByIdAndUpdate({ _id: id }, { $pull: { likes: { _id: req.user._id  } } })
            // else add the like
            await Comment.findByIdAndUpdate({ _id: id }, { $push: { likes: req.user } })
        }

        // Handle replies

        if (req.body.replies) {
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
    getComment,
    postComment,
    updateComment,
    deleteComment
};