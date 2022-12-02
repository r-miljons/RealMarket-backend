const express = require("express");

const { getListings, getPopularListings, getRecentListings } = require("../controllers/listingsController");

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "available GET endpoints at /listings: /all, /popular, /recent" })
})

router.get("/all", getListings)

router.get("/popular", getPopularListings)

router.get("/recent", getRecentListings) 

module.exports = router;