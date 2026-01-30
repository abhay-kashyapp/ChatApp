import express from "express";
import { checkAuth } from "../middlewares/authMiddleware.js";
import { signup, login, logout, updateProfile } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/logout", logout);

router.put("/update-profile", checkAuth, updateProfile);

// Check if user is authenticated (called on app load)
router.get("/check", checkAuth, (req, res) => {
    res.status(200).json(req.user);
});

export default router;