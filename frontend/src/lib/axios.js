import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatapp-2-oblf.onrender.com/api",
  withCredentials: true,
});