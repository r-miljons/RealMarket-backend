const mongoose = require("mongoose");
const Listing = require("../models/listingsModel");

// GET listings

const getListings = async (req, res) => {

    // HANDLE SORT QUERIES
    let sortQuery;

    if (req.query.sort) {
        const availableSortTypes = ["ascending", "descending"];
        const availableFields = ["price", "createdAt", "views"];
        sortQuery = req.query.sort.split(' ');
        // make sure the query includes a field and a type
        if (sortQuery.length !== 2) {
            return res.status(400).json({ error: "Sort query must be formatted similar to the example: ?sort=price+descending" });
        }
        if (!availableFields.includes(sortQuery[0]) || !availableSortTypes.includes(sortQuery[1])) {
            return res.status(400).json({ error: "Available fields for sorting are: " + availableFields.join(", ") + ". And available sorting types are: " + availableSortTypes.join(", ") + "." });
        }

    }

    // HANDLE USER QUERIES
    let userQuery;

    if (req.query.user) {
        // check if id is valid
        if (!mongoose.Types.ObjectId.isValid(req.query.user)) {
            return res.status(400).json({ error: "Invalid ID" }); 
        }
        userQuery = mongoose.Types.ObjectId(req.query.user);
    }
    // HANDLE LIMIT QUERIES
    let limitQuery = 20 // default to 20 results

    if (req.query.limit) {
        // make sure the query is a positive round number
        if (parseInt(req.query.limit) > 0) {
            limitQuery = Math.ceil(parseInt(req.query.limit))
        } else {
            return res.status(400).json({ error: "Limit must be a positive number" });
        }
    }

    //HANDLE SEARCH QUERIES
    let searchQuery;
    if (req.query.search) {
        searchQuery = new RegExp(decodeURIComponent(req.query.search), "i")
    }

    // FIND LISTINGS
    try {
        // filter listings depending on queries
        let listings;

        if (req.query.sort && req.query.user && req.query.search) {
            listings = await Listing.find({ "user._id": userQuery, title: searchQuery }).sort({ [sortQuery[0]]: sortQuery[1] }).limit(limitQuery);
        
        } else if (req.query.sort && req.query.user) {
            listings = await Listing.find({ "user._id": userQuery }).sort({ [sortQuery[0]]: sortQuery[1] }).limit(limitQuery);
        
        } else if (req.query.sort) {
            if (req.query.search) {
                listings = await Listing.find({ title: searchQuery }).sort({ [sortQuery[0]]: sortQuery[1] }).limit(limitQuery);
            } else {
                listings = await Listing.find({}).sort({ [sortQuery[0]]: sortQuery[1] }).limit(limitQuery);
            }
        
        } else if (req.query.user) {
            if (req.query.search) { 
                listings = await Listing.find({ "user._id": userQuery, title: searchQuery }).limit(limitQuery);
            } else {
                listings = await Listing.find({ "user._id": userQuery }).limit(limitQuery);
            }
            
        } else {
            listings = await Listing.find({}).limit(limitQuery);
        }

        res.status(200).json({ data: listings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
	
};

// GET listing

const getListing = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        // incrementing the view count on each get request (too easy to exploit this)
        const listing = await Listing.findByIdAndUpdate(id, { $inc: { views: 1 } });
        if (!listing) {
            return res.status(404).json({ error: "No listing found" });
        }
        res.status(200).json({ data: listing });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST listing

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
        const listing = await Listing.create({ title, description, price, pictures, location, views: 0, user: req.user });
        res.status(200).json({ data: listing });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE listing

const deleteListing = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    // user can only delete his own listing
    // TODO: fix this
    // if (!req.user._id.equals(id)) {
    //     return res.status(401).json({ error: "Unauthorized access" });
    // }

    try {
        const listing = await Listing.findByIdAndDelete(id);
        res.status(200).json({ data: listing });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PATCH listing

const updateListing = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    } 

    // user can only update his own listing
    // TODO: fix this
    // if (!req.user._id.equals(id)) {
    //     return res.status(401).json({ error: "Unauthorized access" });
    // }

    try {
        const listing = await Listing.findByIdAndUpdate(id, req.body);
        res.status(200).json({ data: listing });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getListings, getListing, postListing, deleteListing, updateListing };
