import Users from "../models/userModel.js";
import Messages from "../models/messageModel.js"; 
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";



export const contactsforSidebar = async (req,res) => {
try {
    const loggedUserId  = req.user._id;
    const users = await Users.find({_id: {$ne: loggedUserId}}).select("-password");
    if(users){
     res.status(200).json(users);
    } 
   
} catch (error) {
    console.log("Error in contactsforSidebar:", error.message);
    res.status(500).json({message:"Internal Server Error"});
}
}


export const getMessages = async (req,res) => {
    const receiverId = req.params._id;
    const senderId = req.user._id;
    try {
        const messages = await Messages.find({
            $or:[
                {senderId: senderId, receiverId: receiverId},       
                {senderId: receiverId, receiverId: senderId}
            ]
        }).sort({ createdAt: 1 });

        return res.status(200).json(messages);
        
    } catch (error) {
        console.log("Error in getMessages controllers:", error);
        return res.status(400).json({ message: "Could not fetch messages" });
    }
}

export const sendMessage = async (req,res) => {
try {
    const {text,image} = req.body;
    const receiverId = req.params._id;
    const senderId = req.user._id;

    let imageUrl;
    if(image){
        // Upload image to cloudinary
        const uploadImage = await cloudinary.uploader.upload(image);
        imageUrl = uploadImage.secure_url;
    }
    const newMessage = new Messages({
        senderId,
        receiverId, 
        text,
        image: imageUrl
    });
    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId && io) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    if(newMessage){ 
        res.status(201).json(newMessage);
    }
} catch (error) {
    console.error("Error in sendMessage controllers:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
}