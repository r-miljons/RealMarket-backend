const express = require("express");
const requireAuth = require("../middleware/requireAuth");

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

router.post("/", requireAuth, postListing);

router.delete("/:id", requireAuth, deleteListing);

router.patch("/:id", requireAuth, updateListing);

module.exports = router;
