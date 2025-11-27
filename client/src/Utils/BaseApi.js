import axios from "axios";
import { BASE_URL } from "./constants";

const api = axios.create({
    baseURL: BASE_URL, 
});

api.interceptors.request.use(
    (config) => {
        const authToken = localStorage.getItem("authToken" || "userAccessToken");
        console.log("authToken:", authToken);
        
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("authToken");
            window.location.href = "/admin/admin-login"; // Redirect user to login
        }
        return Promise.reject(error);
    }
);

export default api;
