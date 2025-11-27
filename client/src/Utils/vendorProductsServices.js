import api from './BaseApi.js';

// Add Product for Vendor
export const addVendorProduct = async (productData) => {
    try {
        const authToken = localStorage.getItem("vendorToken");
        if (!authToken) {
            throw new Error("Unauthorized: No vendor token found!");
        }

        const response = await api.post('/api/vendor/products', productData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log("Product added successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error adding product:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while adding product.";
    }
};

// Get Vendor Products
export const getVendorProducts = async (page = 1, limit = 10, search = '', category = 'all') => {
    try {
        const authToken = localStorage.getItem("vendorToken");
        if (!authToken) {
            throw new Error("Unauthorized: No vendor token found!");
        }

        const response = await api.get('/api/vendor/products', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            params: {
                page,
                limit,
                search,
                category
            }
        });

        console.log("Fetched vendor products successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching vendor products:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while fetching products.";
    }
};

// Get Single Vendor Product
export const getVendorProductById = async (productId) => {
    try {
        const authToken = localStorage.getItem("vendorToken");
        if (!authToken) {
            throw new Error("Unauthorized: No vendor token found!");
        }

        const response = await api.get(`/api/vendor/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });

        console.log("Fetched vendor product successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching vendor product:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while fetching product.";
    }
};

// Update Vendor Product
export const updateVendorProduct = async (productId, productData) => {
    try {
        const authToken = localStorage.getItem("vendorToken");
        if (!authToken) {
            throw new Error("Unauthorized: No vendor token found!");
        }

        const response = await api.put(`/api/vendor/products/${productId}`, productData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log("Product updated successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error updating product:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while updating product.";
    }
};




// Delete Vendor Product
export const deleteVendorProduct = async (productId) => {
    try {
        const authToken = localStorage.getItem("vendorToken");
        if (!authToken) {
            throw new Error("Unauthorized: No vendor token found!");
        }

        const response = await api.delete(`/api/vendor/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });

        console.log("Product deleted successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error deleting product:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while deleting product.";
    }
};

// Get Vendor Product Statistics
export const getVendorProductStats = async () => {
    try {
        const authToken = localStorage.getItem("vendorToken");
        if (!authToken) {
            throw new Error("Unauthorized: No vendor token found!");
        }

        const response = await api.get('/api/vendor/products/stats', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        });

        console.log("Fetched vendor product stats successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching vendor product stats:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while fetching product statistics.";
    }
};