const mongoose = require("mongoose");

const listingsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    pictures: {
        type: [Object],
    },
    location: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        required: true
    },
    user: {
        type: Object,
        required: true
    },
    comments: {
        type: [Object]
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model.Listing || mongoose.model("Listing", listingsSchema);
