import axios from "axios";

const API = axios.create({
  baseURL: "https://vibra-p1sk.onrender.com/api", // live backend + /api
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // <-- fix here
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
