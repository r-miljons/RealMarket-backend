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
        type: [String],
    },
    location: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model.Listing || mongoose.model("Listing", listingsSchema);
