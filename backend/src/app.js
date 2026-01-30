


import express from 'express';
import authRoute from './routes/authRoute.js';
import messageRoute from './routes/messageRoute.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { app, server } from './lib/socket.js';

dotenv.config();

const __dirname = path.resolve();

// Middlewares
// CORS must be registered before body parsers so that even early errors
// (like a large payload causing a 413) include CORS headers in the response.
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));

// Increase JSON/body size limits to allow base64 images in requests
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 5000;

// Routes
app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

// Serve frontend static files in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
    });
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL, {
    serverSelectionTimeoutMS: 30000,
})
    .then((res) => {
        console.log("MongoDB Connected: " + res.connection.host);

        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err.message);
    });
