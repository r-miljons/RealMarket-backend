const express = require("express");

const {
    getUsers,
    getUser,
    signupUser,
    loginUser,
    updateUser,
    deleteUser
} = require("../controllers/usersController");

const router = express.Router();

router.get("/", getUsers);

router.get("/:id", getUser);

router.post("/signup", signupUser);

router.post("/login", loginUser);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;