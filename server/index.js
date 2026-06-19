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

app.use(
    cors({
        origin:"https://studynotion-emet.onrender.com",
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

database.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(() => {
        process.exit(1);
    });
