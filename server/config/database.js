const mongoose = require("mongoose");

exports.connect = async () => {
    const mongoUrl = process.env.MONGODB_URL;

    if (!mongoUrl) {
        throw new Error("MONGODB_URL is missing. Add it to your environment variables.");
    }

    try {
        await mongoose.connect(mongoUrl);
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Error:", error.message);
        throw error;
    }
};
