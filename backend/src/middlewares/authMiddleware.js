import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const checkAuth = async(req, res,next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
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