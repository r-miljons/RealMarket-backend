const mongoose = require("mongoose");
const Listing = require("../models/listingsModel");

// GET handlers
const getListings = async (req, res) => {
    // handle sort queries
    let sortQuery;

    if (req.query.sort) {
        const availableSortTypes = ["ascending", "descending"];
        const availableFields = ["price", "createdAt", "views"];
        sortQuery = req.query.sort.split(' ');
        // make sure the query includes a field and a type
        if (sortQuery.length !== 2) {
            return res.status(404).json({ error: "Sort query must be formatted similar to the example: ?sort=price+descending" });
        }
        if (!availableFields.includes(sortQuery[0]) || !availableSortTypes.includes(sortQuery[1])) {
            return res.status(404).json({ error: "Available fields for sorting are: " + availableFields.join(", ") + ". And available sorting types are: " + availableSortTypes.join(", ") + "." });
        }

    }

    try {
        let listings;
        if (req.query.sort) {
            listings = await Listing.find({}).sort({ [sortQuery[0]]: sortQuery[1] });
        } else {
            listings = await Listing.find({})
        }
        res.status(200).json({ data: listings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
	
};

// const getPopularListings = async (req, res) => {
// 	try {
//         const listings = await Listing.find({}).sort({ views: -1 })
//         res.status(200).json({ data: listings });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// const getRecentListings = async (req, res) => {
// 	try {
//         const listings = await Listing.find({}).sort({ createdAt: -1 })
//         res.status(200).json({ data: listings });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

const getListing = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID" });
    }

    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ error: "No listing found" });
        }
        res.status(200).json({ data: listing });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST handlers

const postListing = async (req, res) => {
    let { title, description, price, pictures, location } = req.body

    // requested field handling
    const emptyFields = [];

    if (!title) {
        emptyFields.push("Title");
    }
    if (!description) {
        emptyFields.push("Description");
    }
    if (!price) {
        emptyFields.push("Price");
    }
    if (!pictures) {
        pictures = [];
    }
    if (!location) {
        emptyFields.push("Location");
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: "Please fill in the fields: " + emptyFields.join(", ") });
    }

    try {
        const listing = await Listing.create({ title, description, price, pictures, location, views: 0 });
        res.status(200).json({ data: listing });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { getListings, getListing, postListing };
