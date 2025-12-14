import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatapp-2-oblf.onrender.com/api",
  withCredentials: true,
});

// Attach stored token (if any) to Authorization header for subsequent requests
const token = localStorage.getItem("token");
if (token) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}