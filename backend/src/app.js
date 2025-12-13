


import express from 'express';
import authRoute from './routes/authRoute.js';
import messageRoute from './routes/messageRoute.js'; 
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app,server} from './lib/socket.js';

dotenv.config();


// Middlewares
// CORS must be registered before body parsers so that even early errors
// (like a large payload causing a 413) include CORS headers in the response.
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));

// Increase JSON/body size limits to allow base64 images in requests
// (consider switching to multipart/form-data for large file uploads)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Note: explicit `app.options('*', ...)` caused a path parsing error in some
// environments (path-to-regexp treats '*' as an invalid parameter). The
// `cors()` middleware above handles OPTIONS preflight automatically, so
// we don't need an explicit handler here.

const port = process.env.PORT || 5000;

// Routes
app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

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
  
