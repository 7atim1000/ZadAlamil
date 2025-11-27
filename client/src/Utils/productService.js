import api from './BaseApi.js' ;

export const addProduct = async (productData) => {
    try {
        const authToken = localStorage.getItem("authToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        
        const response = await api.post("/api/admin/add-product", productData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'multipart/form-data'
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while creating the product.";
    }
};


export const getProducts = async ( page = 1, limit = 10, status = "all", search = "") => {
    try {
        const authToken = localStorage.getItem("authToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }

        const response = await api.get(`/api/admin/get-products?page=${page}&limit=${limit}&search=${search}&status=${status}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        console.log("Fetched products data:", response.data);

        return {
            products: response.data.products,
            totalProducts: response.data.totalProducts,
            totalPages: response.data.totalPages,
        };
    } catch (error) {
        throw error.response?.data?.message || "Something went wrong";
    }
};


export const deleteProduct = async (productId) => {
    try {
        const authToken = localStorage.getItem("authToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }

        const response = await api.delete(`/api/admin/delete-product/${productId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Something went wrong";
    }
};



export const updateProduct = async (productId, productData) => {
    try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            throw new Error("Unauthorized: No token found!");
        }

        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("category", productData.category);
        formData.append("price", productData.price);
        formData.append("description", productData.description);
        formData.append("stock", productData.stock);
        formData.append("color", productData.color);

        if (productData.productImg) {
            formData.append("productImg", productData.productImg);
        }

        const response = await api.put(`/api/admin/edit-product/${productId}`, formData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "multipart/form-data",  
            },
        });

        return response.data; 
    } catch (error) {
        console.error("Error updating category:", error);
        throw error.response?.data?.message || "Something went wrong";
    }
};

