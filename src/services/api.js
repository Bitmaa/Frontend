import axios from "axios";

// Make sure this matches your backend port
const api = axios.create({
  baseURL: "http://localhost:9000/api",
});

export default api;
