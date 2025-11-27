import api from './BaseApi.js';

export const getUsers = async (page, limit, status, search) => {
    
    try {
        const authToken = localStorage.getItem("authToken");
    
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        const response = await api.get(`/api/admin/users-list`, {
            params: { page, limit, status, search },
            headers: { Authorization: `Bearer ${authToken}` }, 
        });
        console.log("API Response:", response.data.users);
        return {
            users: response.data.users,
            totalUsers: response.data.totalUsers,
            totalPages: response.data.totalPages,
        };
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const updateUserStatus = async (userId, status) => {

    try {
        const authToken = localStorage.getItem("authToken");
    
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        const response = await api.put(
            `/api/admin/edit-user-status/${userId}`,
            { status },
            { headers: { Authorization: `Bearer ${authToken}` } }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating user status:", error);
        throw error;
    }
};

export const deleteUser = async (userId) => {

    try {
        const authToken = localStorage.getItem("authToken");
    
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        const response = await api.delete(`/api/admin/delete-user/${userId}`, {
            headers: { Authorization: `Bearer ${authToken}`},
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting user: ", error);
        throw error;
    }
};