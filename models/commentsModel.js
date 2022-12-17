const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema(
	{
		text: { type: String, required: true },
		likes: { type: [Object] },
		replies: { type: [Object] },
        user: { type: Object, required: true },
        listing: { type: Object, required: true }
	},
	{ timestamps: true }
);

module.exports = mongoose.model.Comment || mongoose.model("Comment", commentsSchema);
