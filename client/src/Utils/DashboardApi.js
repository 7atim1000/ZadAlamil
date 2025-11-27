import api from './BaseApi.js';

export const getDashboard = async () => {
    try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            throw new Error("Unauthorized: No token found!");
        }

        const response = await api.get(`/api/admin/admin-dashboard`, { // Fixed endpoint
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        console.log("Fetched dashboard data successfully:", response.data);
        return response.data; // Return the entire response data
        
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
        throw new Error(errorMessage);
    }
};