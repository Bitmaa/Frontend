import axios from "axios";

// Deployed backend URL
const api = axios.create({
  baseURL: "https://vibra-kzox.onrender.com/api",  // note the /api
  withCredentials: true, // keep if your backend uses cookies/sessions
});

export default api;
