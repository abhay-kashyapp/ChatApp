import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const checkAuth = async(req, res,next) => {
    try {
        // Debug: show incoming auth related values
        console.log("[authMiddleware] cookies:", req.cookies);
        console.log("[authMiddleware] authorization header:", req.headers.authorization || req.headers.Authorization);

        // Prefer cookie-based JWT (httpOnly), fall back to Authorization header
        let token = req.cookies?.jwt;
        if (!token) {
            const authHeader = req.headers.authorization || req.headers.Authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if(!token){
           console.log("[authMiddleware] no token found");
           return res.status(401).json({ message: "Authentication token is required" });
        }
        let decode;
        try {
            decode = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        const user = await User.findById(decode.userId).select("-password");
        if(!user){
             return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        return next();

    } catch (error) {
        console.log("error in auth middleware:", error.message);
        res.status(500).json({ message: " Internal Server Error" })
    }
}