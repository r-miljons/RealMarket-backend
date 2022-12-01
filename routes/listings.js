const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "available GET endpoints at /listings: /all, /popular, /recent" })
})

router.get("/all", (req, res) => {
    res.status(200).json({ message: "all listings" })
})

router.get("/popular", (req, res) => {
    res.status(200).json({ message: "popular listings" })
})

router.get("/recent", (req, res) => {
    res.status(200).json({ message: "most recent listings" })
})

module.exports = router;