import api from './BaseApi.js';

export const fetchBrands = async (page = 1, limit = 10, status = 'all', search = "") => {
    try {
        const authToken = localStorage.getItem("authToken");
    
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }

        console.log("Fetching brands with token:", authToken);
        const response = await api.get(`/api/admin/get-brands?page=${page}&limit=${limit}&search=${search}&status=${status}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        console.log("Fetched brands data:", response.data);

        return {
            brands: response.data.brands,
            totalBrands: response.data.totalBrands,
            totalPages: response.data.totalPages,
        };
    } catch (error) {
        console.error("Error fetching brands:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while fetching brands.";
    }
};


export const createBrand = async (brandData) => {
    try {
        const authToken = localStorage.getItem("authToken");
        
            if(!authToken) {
                throw new Error("Unauthorized: No token found!");
            }
        const response = await api.post("/api/admin/create-brand", brandData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data; 
    } catch (error) {
        console.error("Error creating brand:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while creating the brand.";
    }
};

export const deleteBrand = async (brandId) => {
    try {
        const authToken = localStorage.getItem("authToken");
        
            if(!authToken) {
                throw new Error("Unauthorized: No token found!");
            }
        const response = await api.delete(`/api/admin/delete-brand/${brandId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        return response.data; 
    } catch (error) {
        console.error("Error deleting brand:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while deleting the brand.";
    }
};

export const updateBrandStatus = async (brandId, statusData) => {
    try {
        const authToken = localStorage.getItem("authToken");
        
            if(!authToken) {
                throw new Error("Unauthorized: No token found!");
            }
        const response = await api.put(`/api/admin/edit-brand-status/${brandId}`, statusData,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`, 
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Error updating brand status:", error);
        throw error; 
    }
};

export const updateBrand = async (brandId, brandData) => {
    try {
        const authToken = localStorage.getItem("authToken");
        
            if(!authToken) {
                throw new Error("Unauthorized: No token found!");
            }
        const formData = new FormData();
        formData.append("name", brandData.name);
        if (brandData.logo) {
            formData.append("logo", brandData.logo); 
        }

        const response = await api.put(`/api/admin/update-brand/${brandId}`, formData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "multipart/form-data",  
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating brand:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while updating the brand.";
    }
};

export const checkBrandNameExists = async (brandName) => {
    try {
        const authToken = localStorage.getItem("authToken");
        
            if(!authToken) {
                throw new Error("Unauthorized: No token found!");
            }
        const response = await api.get(`/api/admin/check-brand-name/${brandName}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        const data = response.data;

        if (response.status === 200) {
            return { exists: false, message: data.message };
        } else {
            return { exists: true, message: data.message };
        }
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};
