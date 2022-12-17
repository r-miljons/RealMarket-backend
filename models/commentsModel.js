const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema(
	{
		text: { type: String, required: true },
		likes: { type: Number, required: true },
		replies: { type: [Object], required: true },
        user: { type: Object, required: true }
	},
	{ timestamps: true }
);

module.exports = mongoose.model.Comment || mongoose.model("Comment", commentsSchema);
