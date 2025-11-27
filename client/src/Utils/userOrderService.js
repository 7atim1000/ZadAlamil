import api from './BaseApi';

export const createUserOrder = async (orderData) => {
    try {
        const authToken = localStorage.getItem("userAccessToken");
        if (!authToken) {
            throw new Error("Unauthorized: No token found!");
        }

        console.log("Sending orderData:", orderData);

        const response = await api.post("/api/user/order/create", orderData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log("Order created successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error creating order:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while creating order.";
    }
};

// Get user's cart items
// Get user's orders (plural - returns multiple orders)
export const getUserOrders = async () => {
    try {
        const authToken = localStorage.getItem("userAccessToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        
        // FIXED: Correct endpoint - matches your backend route
        const response = await api.get("/api/user/user-orders", {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        console.log("Fetched user orders successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching user orders:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while fetching your orders.";
    }
};


export const getOrderById = async (orderId) => {
    try {
        const authToken = localStorage.getItem("userAccessToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        
        const response = await api.get(`/api/user/order/${orderId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        console.log("Fetched order successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching order:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while fetching order.";
    }
};

// Cancel order
export const cancelOrder = async (orderId) => {
    try {
        const authToken = localStorage.getItem("userAccessToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        
        const response = await api.put(`/api/user/order/${orderId}/cancel`, {}, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        console.log("Order cancelled successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error cancelling order:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while cancelling order.";
    }
};

// Request return
export const requestReturn = async (orderId, reason = '') => {
    try {
        const authToken = localStorage.getItem("userAccessToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        
        const response = await api.post(`/api/user/order/${orderId}/return`, {
            reason
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
        });

        console.log("Return requested successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error requesting return:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while requesting return.";
    }
};