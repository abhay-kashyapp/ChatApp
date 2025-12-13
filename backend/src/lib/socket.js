// import express from "express";
// import { Server } from "socket.io";
// import http from "http";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//     cors: {
//         origin: ["http://localhost:5173",
//           "https://chatapp-3-w37m.onrender.com" // deployed frontend
//        ],
//        },
//       });
     


//     export    const getReceiverSocketId = (userId) => {
//         return userSocket[userId];
//       }  



//      const userSocket = {}


//       io.on("connection", (socket) => {
//         console.log("User  connected:", socket.id);

//         const userId = socket.handshake.query.userId;
//         if (userId) {
//           userSocket[userId] = socket.id;
//         }
//         io.emit("getOnlineUsers", Object.keys(userSocket));

//         socket.on("disconnect", () => {
//           console.log("User disconnected:", socket.id);
//           delete userSocket[userId];
//           io.emit("getOnlineUsers", Object.keys(userSocket));
//         });
//       });

//       export {app, server, io};



import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",              // local dev
      "https://chatapp-3-w37m.onrender.com" // deployed frontend
    ],
    credentials: true,
  },
});

const userSocket = {};

export const getReceiverSocketId = (userId) => {
  return userSocket[userId];
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

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
