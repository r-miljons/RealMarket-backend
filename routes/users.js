const express = require("express");
const requireAuth = require("../middleware/requireAuth");

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

router.patch("/:id", requireAuth, updateUser);

router.delete("/:id", requireAuth, deleteUser);

module.exports = router;