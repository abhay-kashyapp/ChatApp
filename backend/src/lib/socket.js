import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});



export const getReceiverSocketId = (userId) => {
  return userSocket[userId];
}



const userSocket = {}


io.on("connection", (socket) => {
  console.log("User  connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocket[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(userSocket));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSocket[userId];
    io.emit("getOnlineUsers", Object.keys(userSocket));
  });
});

export { app, server, io };