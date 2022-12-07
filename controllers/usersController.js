const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const mongoose = require("mongoose");

// creating a token for authentication
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.JWT_SECRET, { expiresIn: "999 years" });
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ data: users });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

const getUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const user = await User.findOne({_id: id});
        if (!user) {
            return res.status(404).json({ error: "No user found" });
        }
        res.status(200).json({ data: user });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

const signupUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.signup(username, password);
        const token = createToken(user._id);
        res.status(200).json({ username, id: user._id, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.status(200).json({ username, id: user._id, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    // TODO: add ability to change password
    if (req.body.password) {
        return res.status(400).json({ error: "Can't update password" });
    }

    // if username is empty string
    if (!req.body.username) {
        return res.status(400).json({ error: "Invalid username" });
    }

    try {
        const user = await User.findByIdAndUpdate({ _id: id }, { ...req.body });
        if (!user) {
            return res.status(404).json({ error: "No user found" });
        }
        res.status(200).json({ data: user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const user = await User.findByIdAndDelete({ _id: id });
        res.status(200).json({ data: user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getUsers,
    getUser,
    signupUser,
    loginUser,
    updateUser,
    deleteUser
};