const jwt = require('jsonwebtoken');

//auth
exports.auth = async (req, res, next) => {
    try {
        //fetch token from header
        const token = req.cookies?.token ||
              req.header("Authorization")?.replace("Bearer ", "");

        //if token missing , then return response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        //verify token
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

        } catch (error) {
            console.log("Error in verifying token", error);
            const message = error.name === "TokenExpiredError"
                ? "Session expired. Please log in again."
                : "Invalid token. Please log in again.";

            return res.status(401).json({
                success: false,
                message,
            });
        }
        next();
    } catch (error) {
        console.log("Error in auth middleware", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
}


//isStudent

exports.isStudent = async (req, res, next) => {
    try {
        if(req.user.accountType !== "User" && req.user.accountType !== "Student") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only students are allowed.",
            });
        }
        next();

    } catch (error) {
        console.log("Error in isStudent middleware", error);
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified",
        });
    }
}

//isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        if(req.user.accountType !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only instructors are allowed.",
            });
        }
        next();

    } catch (error) {
        console.log("Error in isInstructor middleware", error);
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified",
        });
    }
}

//isAdmin

exports.isAdmin= async (req, res, next) => {
    try {
        if(req.user.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only admins are allowed.",
            });
        }
        next();

    } catch (error) {
        console.log("Error in isAdmin middleware", error);
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified",
        });
    }
}
