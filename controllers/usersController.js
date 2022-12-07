const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");

// creaating a token for authentication
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.JWT_SECRET, { expiresIn: "999 years" });
}

const getUsers = async (req, res) => {

};

const getUser = async (req, res) => {

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

};

const deleteUser = async (req, res) => {

};

module.exports = {
    getUsers,
    getUser,
    signupUser,
    loginUser,
    updateUser,
    deleteUser
};