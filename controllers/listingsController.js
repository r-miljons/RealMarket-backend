const mongoose = require("mongoose");
const Listing = require("../models/listingsModel");

const getListings = async (req, res) => {
    try {
        const listings = await Listing.find({});
        res.status(200).json({ data: listings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
	
};

const getPopularListings = async (req, res) => {
	try {
        const listings = await Listing.find({}).sort({ views: -1 })
        res.status(200).json({ data: listings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getRecentListings = async (req, res) => {
	try {
        const listings = await Listing.find({}).sort({ createdAt: -1 })
        res.status(200).json({ data: listings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getListing = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID" });
    }

    try {
        const listing = Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ error: "No listing found" });
        }
        res.status(200).json({ data: listing });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getListings, getPopularListings, getRecentListings, getListing };
