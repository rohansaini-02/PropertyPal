import axios from "axios";
axios.defaults.withCredentials = true;

const apiRequest = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    withCredentials: true,
});

export default apiRequest;