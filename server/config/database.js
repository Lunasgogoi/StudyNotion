const mongoose = require("mongoose");

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log("DB Connected"))
        .catch((error) => {
            console.log("DB Connection Error:", error);
            process.exit(1);
        });
};