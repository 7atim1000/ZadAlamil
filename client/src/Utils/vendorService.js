import api from './BaseApi.js';

export const fetchVendors = async (page = 1, limit = 5) => {
    try {
        const authToken = localStorage.getItem("authToken");

        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }

        const response = await api.get(`/api/admin/vendors?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${authToken}`},
        });
        return response.data; // Remove the await here
    } catch (error) {
        throw new Error(error.message);
    }
};




export const deleteVendor = async (vendorId) => {
    try {
        const authToken = localStorage.getItem("authToken");

        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        const response = await api.delete(`/api/admin/delete-vendor/${vendorId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        return response.data; 
    } catch (error) {
        console.error("Error deleting vendor:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while deleting the vendor.";
    }
};

export const updateVendorStatus = async (vendorId, statusData, ) => {
    try {
        const authToken = localStorage.getItem("authToken");

        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        const response = await api.put(`/api/admin/edit-vendor-status/${vendorId}`, statusData,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`, 
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Error updating vendor status:", error);
        throw error; 
    }
};