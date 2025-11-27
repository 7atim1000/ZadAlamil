import api from './BaseApi.js';

// Add Category for Vendor
export const addVendorCategory = async (categoryData) => {
    try {
        const authToken = localStorage.getItem("vendorToken");
        if (!authToken) {
            throw new Error("Unauthorized: No vendor token found!");
        }

        const response = await api.post('/api/vendor/categories', categoryData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log("Category added successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error adding category:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while adding category.";
    }
};

// Get Vendor Categories
export const getVendorCategories = async (page = 1, limit = 10, search = '', status = 'all') => {
    try {
        const authToken = localStorage.getItem("vendorToken");
        if (!authToken) {
            throw new Error("Unauthorized: No vendor token found!");
        }

        const response = await api.get('/api/vendor/categories', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            params: {
                page,
                limit,
                search,
                status
            }
        });

        console.log("Fetched vendor categories successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching vendor categories:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while fetching categories.";
    }
};

// Get Single Vendor Category
export const getVendorCategoryById = async (categoryId) => {
    try {
        const authToken = localStorage.getItem("vendorToken");
        if (!authToken) {
            throw new Error("Unauthorized: No vendor token found!");
        }

        const response = await api.get(`/api/vendor/categories/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });

        console.log("Fetched vendor category successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching vendor category:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while fetching category.";
    }
};

// Update Vendor Category
export const updateVendorCategory = async (categoryId, categoryData) => {
    try {
        const authToken = localStorage.getItem("vendorToken");
        if (!authToken) {
            throw new Error("Unauthorized: No vendor token found!");
        }

        const response = await api.put(`/api/vendor/categories/${categoryId}`, categoryData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log("Category updated successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error updating category:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while updating category.";
    }
};

// Delete Vendor Category
export const deleteVendorCategory = async (categoryId) => {
    try {
        const authToken = localStorage.getItem("vendorToken");
        if (!authToken) {
            throw new Error("Unauthorized: No vendor token found!");
        }

        const response = await api.delete(`/api/vendor/categories/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });

        console.log("Category deleted successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error deleting category:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while deleting category.";
    }
};