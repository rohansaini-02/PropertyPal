import axios from "axios";
axios.defaults.withCredentials = true;

const apiRequest = axios.create({
    baseURL: "https://propertypal-wbh0.onrender.com/api",
    withCredentials: true,
});

export default apiRequest;