import express from "express";
import { checkAuth } from "../middlewares/authMiddleware.js";
import { contactsforSidebar, getMessages, sendMessage } from "../controllers/messageController.js";

const route  = express.Router();

route.get("/users",checkAuth, contactsforSidebar);
route.get("/getmessages/:_id",checkAuth, getMessages);
route.post("/sendmessage/:_id",checkAuth,sendMessage);

export default route;