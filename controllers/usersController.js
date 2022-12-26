const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const mongoose = require("mongoose");
const validator = require("validator");

// creating a token for authentication
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.JWT_SECRET, { expiresIn: "999 years" });
}

// GET users

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.status(200).json({ data: users });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

// GET user

const getUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const user = await User.findOne({_id: id}).select("-password");
        if (!user) {
            return res.status(404).json({ error: "No user found" });
        }
        res.status(200).json({ data: user });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

// SIGNUP user

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

// LOGIN user

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

// UPDATE user

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
    if (req.body.username?.length === 0) {
        return res.status(400).json({ error: "Invalid username" });
    }

    // user can only update his own profile
    if (!req.user._id.equals(id)) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    // check if username is taken when updating it
    if (req.body.username) {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            return res.status(400).json({ error: "Username already taken" });
        }
    }

    if (req.body.email) {
        if (!validator.isEmail(req.body.email)) {
            return res.status(400).json({ error: "Invalid email" });
        }
    }

    if (req.body.phone) {
        if (!validator.isNumeric(req.body.email)) {
            return res.status(400).json({ error: "Phone number must contain only numbers" });
        }
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

// DELETE user

const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    // user can only delete his own profile
    if (!req.user._id.equals(id)) {
        return res.status(401).json({ error: "Unauthorized access" });
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