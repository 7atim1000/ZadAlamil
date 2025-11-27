import axios from "axios";
import { BASE_URL } from "./constants";

const api = axios.create({
    baseURL: BASE_URL, 
});

api.interceptors.request.use(
    (config) => {
        const vendorToken = localStorage.getItem("vendorToken");
        if (vendorToken) {
            config.headers.Authorization = `Bearer ${vendorToken}`;
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
            localStorage.removeItem("vendorToken");
            window.location.href = "/vendor/vendor-login";
        }
        return Promise.reject(error);
    }
);

export default api;
