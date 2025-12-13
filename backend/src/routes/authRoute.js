import express from "express";
import { checkAuth } from "../middlewares/authMiddleware.js";
import { signup, login, logout,updateProfile } from "../controllers/authController.js";

const router = express.Router();


router.post("/signup", signup);

router.post("/login", login);

router.get("/logout", logout);

router.put("/update-profile",checkAuth,updateProfile);

export default router;