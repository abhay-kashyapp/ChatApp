import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
//import { connect, disconnect, get } from "mongoose";
import io from "socket.io-client";

export const authStore = create((set,get) => ({
    loggedUser: null,
    onlineUsers: [],
      socket: null,


    signup:async (data) => {
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ loggedUser: res.data });
            toast.success("Signup Successful");
            get().connectSocket();
        } catch (error) { 
           toast.error( "Signup Failed : Please try again later"); 
           set({ loggedUser: null });
        }
    },

    login: async (data) => {
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ loggedUser: res.data });
            toast.success("Login Successful");
            get().connectSocket();
        } catch (error) {
            toast.error("Login Failed: Please check your credentials");
            set({ loggedUser: null });
        }
    },

    logout: async (  ) => {
        try {
           await axiosInstance.get("/auth/logout");
            set({ loggedUser: null });
            toast.success("Logout Successful");
            get().disconnectSocket();
        } catch (error) {
            toast.error("Logout Failed: Please try again later");
        }
    },

    updateProfile: async (data) => {
        try {
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({ loggedUser: res.data });
            toast.success("Profile Updated Successfully");
        } catch (error) {
            toast.error("Profile Update Failed: Please try again later");
        }
    },


    connectSocket: () => {
        const { loggedUser } = get(); 
        const socket = io("http://localhost:5000",{
            query: { userId:loggedUser._id }

        });  
        socket.connect();
        set({ socket : socket });
        socket.on("getOnlineUsers",(userIds) => {
            set({ onlineUsers: userIds });
            console.log("Online Users:", userIds);
        });
    },

    
    disconnectSocket: () => {
      if(get().socket?.connected ) get().socket.disconnect();
    },
}));