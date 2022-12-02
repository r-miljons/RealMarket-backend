const getListings = async (req, res) => {
	res.status(200).json({ message: "all listings" });
};

const getPopularListings = async (req, res) => {
	res.status(200).json({ message: "popular listings" });
};

const getRecentListings = async (req, res) => {
	res.status(200).json({ message: "most recent listings" });
};

module.exports = { getListings, getPopularListings, getRecentListings };
