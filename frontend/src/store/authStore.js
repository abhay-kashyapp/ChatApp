import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import io from "socket.io-client";

const BASE_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const authStore = create((set, get) => ({
    loggedUser: null,
    onlineUsers: [],
    socket: null,
    isCheckingAuth: true,

    // Check if user is already authenticated (called on app load)
    checkAuth: async () => {
        try {
            console.log("Checking auth...");
            const res = await axiosInstance.get("/auth/check");
            console.log("Auth check response:", res.data);
            // Only set loggedUser if we got a valid user object with _id
            if (res.data && res.data._id) {
                set({ loggedUser: res.data });
                get().connectSocket();
            } else {
                console.log("Invalid user data received, setting loggedUser to null");
                set({ loggedUser: null });
            }
        } catch (error) {
            console.log("Auth check failed:", error?.response?.status, error?.message);
            set({ loggedUser: null });
        } finally {
            console.log("Auth check complete, isCheckingAuth: false");
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ loggedUser: res.data });
            toast.success("Signup Successful");
            get().connectSocket();
        } catch (error) {
            toast.error("Signup Failed : Please try again later");
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

    logout: async () => {
        try {
            await axiosInstance.get("/auth/logout");
            get().disconnectSocket();
            // Clear all user-related state
            set({ loggedUser: null, onlineUsers: [] });
            // Also clear chat state by resetting chatStore
            const chatStoreModule = await import('./chatStore.js');
            chatStoreModule.chatStore.getState().clearChatState?.();
            toast.success("Logout Successful");
        } catch (error) {
            // Even if logout API fails, still clear local state
            get().disconnectSocket();
            set({ loggedUser: null, onlineUsers: [] });
            toast.error("Logout Failed: Please try again later");
        }
    },

    updateProfile: async (data) => {
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ loggedUser: res.data });
            toast.success("Profile Updated Successfully");
        } catch (error) {
            toast.error("Profile Update Failed: Please try again later");
        }
    },

    connectSocket: () => {
        const { loggedUser, socket } = get();

        // Don't connect if no user or already connected
        if (!loggedUser || socket?.connected) {
            return;
        }

        const newSocket = io(BASE_URL, {
            query: { userId: loggedUser._id },
        });

        newSocket.connect();

        newSocket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
            console.log("Online Users:", userIds);
        });

        set({ socket: newSocket });
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },
}));