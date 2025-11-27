import api from './BaseApi';

// Get user's cart items
export const getUserCart = async () => {
    try {
        // You're storing as "userAccessToken" but retrieving as "token"
        const authToken = localStorage.getItem("userAccessToken"); // ← FIX THIS
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        
        const response = await api.get("/api/user/cart", {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        console.log("Fetched user cart successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching user cart:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while fetching your cart.";
    }
};

// Add item to cart
export const addUserCart = async (productData) => {
    try {
        const authToken = localStorage.getItem("userAccessToken"); // ← FIX THIS TOO
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        
        console.log("Sending productData:", productData);
        
        const response = await api.post("/api/user/cart/add", productData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log("Full API response:", response);
        return response.data;

    } catch (error) {
        console.error("Full error in service:", error);
        console.error("Error response data:", error.response?.data);
        throw error.response?.data?.message || "Something went wrong while adding item to your cart.";
    }
};
// export const addUserCart = async (productData) => {
//     try {
//         const authToken = localStorage.getItem("token");
//         if(!authToken) {
//             throw new Error("Unauthorized: No token found!");
//         }
        
//         console.log("Sending productData:", productData);
        
//         const response = await api.post("/api/user/cart/add", productData, {
//             headers: {
//                 Authorization: `Bearer ${authToken}`,
//                 'Content-Type': 'application/json',
//             },
//         });

//         console.log("Full API response:", response);
//         console.log("Response data:", response.data);
//         console.log("Response status:", response.status);
        
//         return response.data;

//     } catch (error) {
//         console.error("Full error in service:", error);
//         console.error("Error response data:", error.response?.data); // This is important!
//         console.error("Error status:", error.response?.status);
//         console.error("Error message:", error.message);
//         throw error.response?.data?.message || "Something went wrong while adding item to your cart.";
//     }
// };

// Update cart item quantity
export const updateCartItem = async (cartItemId, quantity) => {
    try {
        const authToken = localStorage.getItem("userAccessToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        
        const response = await api.put(`/api/user/cart/update/${cartItemId}`, 
            { quantity },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Cart item updated successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error updating cart item:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while updating cart item.";
    }
};

// Remove item from cart
export const removeCartItem = async (cartItemId) => {
    try {
        const authToken = localStorage.getItem("userAccessToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        
        const response = await api.delete(`/api/user/cart/remove/${cartItemId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        console.log("Item removed from cart successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error removing item from cart:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while removing item from cart.";
    }
};

// Clear entire cart
export const clearUserCart = async () => {
    try {
        const authToken = localStorage.getItem("userAccessToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        
        const response = await api.delete("/api/user/cart/clear", {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        console.log("Cart cleared successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error clearing cart:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while clearing your cart.";
    }
};