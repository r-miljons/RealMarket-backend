const express = require("express");

const {
	getListings,
    getListing,
    postListing,
    deleteListing,
    updateListing,
} = require("../controllers/listingsController");

const router = express.Router();

router.get("/:id", getListing);

router.get("/", getListings);

router.post("/", postListing);

router.delete("/:id", deleteListing);

router.patch("/:id", updateListing);

module.exports = router;
