const mongoose = require("mongoose");
require("dotenv").config()

const dbConfig = async () => {
	try {
		await mongoose.connect(process.env.DB_URL);
		console.log("MongoDB connected");
	} catch (error) {
		console.error("MongoDB connection error:", error);
	}
};

module.exports = dbConfig;