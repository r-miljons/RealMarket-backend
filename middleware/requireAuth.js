const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(400).json({ error: "Authorizaton token required" });
    }

    const token = authorization.split(" ")[1];

    try {
        const {_id} = jwt.verify(token, process.env.JWT_SECRET);
        // add the user to the request object to be passed along
        req.user = await User.findOne({ _id }).select("-password");
        next();
    } catch (err) {
        res.status(401).json({ error: "Unauthorized access" });
    }
};

module.exports = requireAuth;