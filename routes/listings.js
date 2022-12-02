const express = require("express");

const {
	getListings,
    getListing,
    postListing,
} = require("../controllers/listingsController");

const router = express.Router();

router.get("/:id", getListing);

router.get("/", getListings);

router.post("/", postListing)

module.exports = router;
