require("dotenv").config();

const express = require("express");
const app = express();

// Routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactRoutes = require("./routes/Contact");

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
        tempFileDir: "./tmp/", 
    })
);

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://study-notion-iota-khaki-83.vercel.app",
    "https://study-notion-git-main-lunas-gogoi-s-projects.vercel.app",
    "https://studynotion-emet.onrender.com",
    ...(process.env.FRONTEND_URLS || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
];

app.use(
    cors({
        origin: (origin, callback) => {
            const isVercelPreview = origin?.endsWith(".vercel.app");

            if (!origin || allowedOrigins.includes(origin) || isVercelPreview) {
                return callback(null, true);
            }

            return callback(new Error(`CORS blocked origin: ${origin}`));
        },
        credentials: true,
    })
);

cloudinaryConnect();

// Mount Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/reach", contactRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
    });
});

// Start Server cleanly
const startServer = async () => {
    try {
        // Ensure your config/database.js connects using process.env.MONGODB_URL
        await database.connect(); 
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
