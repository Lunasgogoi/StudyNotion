require("dotenv").config();

const express = require("express");
const app = express();


// Routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");

// Configs
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 4000;


app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "./tmp/", // Added a dot to make it relative to your project folder
    })
);

app.use(express.json());

app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://studynotion-emet.onrender.com",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error(`CORS blocked origin: ${origin}`));
        },
        credentials: true,
    })
);


cloudinaryConnect();


app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
    });
});


 //START

const contactRoutes = require("./routes/Contact");
app.use("/api/v1/reach", contactRoutes);

const startServer = async () => {
    const deployedMongoUrl = process.env.MONGODB_URL;
    const localMongoUrl = process.env.LOCAL_MONGODB_URL || "mongodb://127.0.0.1:27017/studynotion";

    const mongoUrls = [
        { label: "local MongoDB", url: localMongoUrl },
        { label: "deployed MongoDB", url: deployedMongoUrl },
    ].filter(({ url }) => Boolean(url));

    for (const { label, url } of mongoUrls) {
        try {
            console.log(`Trying ${label}...`);
            process.env.MONGODB_URL = url;
            await database.connect();
            console.log(`Connected using ${label}`);

            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
            return;
        } catch (error) {
            console.error(`Could not connect using ${label}:`, error.message);
        }
    }

    console.error("Could not connect to any MongoDB URL");
    process.exit(1);
};

startServer();
