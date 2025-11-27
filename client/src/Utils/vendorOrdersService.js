import api from './BaseApi.js';

export const getVendorOrders = async (page = 1, limit = 10, status = '') => {
    try {
        const authToken = localStorage.getItem("vendorToken");
        if (!authToken) {
            throw new Error("Unauthorized: No vendor token found!");
        }

        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (status) {
            params.append('status', status);
        }

        const response = await api.get(`/api/vendor/orders?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        // Check if response indicates authentication issue
        if (response.data.message?.includes('Unauthorized') || response.data.message?.includes('token')) {
            throw new Error("Authentication failed");
        }

        console.log("Fetched vendor orders successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching vendor orders:", error.response?.data || error.message);
        
        // Re-throw with specific messages for different status codes
        if (error.response?.status === 401) {
            throw new Error("Unauthorized: Please login again");
        } else if (error.response?.status === 403) {
            throw new Error("Access denied: Vendor privileges required");
        } else {
            throw new Error(error.response?.data?.message || "Something went wrong while fetching vendor orders.");
        }
    }
};


  // get vendor order statistics
  export const getVendorOrderStats = async () => {
    try {
      const authToken = localStorage.getItem("vendorToken");
      if (!authToken) {
        throw new Error("Unauthorized: No vendor token found!");
      }

      const response = await api.get("/api/vendor/orders/stats", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("Fetched vendor order stats successfully:", response.data);
      return response.data;

    } catch (error) {
      console.error("Error fetching vendor order stats:", error.response?.data || error.message);
      throw error.response?.data?.message || "Something went wrong while fetching vendor order statistics.";
    }
  };




export const getVendorOrderById = async (orderId) => {
    try {
        const authToken = localStorage.getItem("vendorToken");
        if (!authToken) {
            throw new Error("Unauthorized: No vendor token found!");
        }

        const response = await api.get(`/api/vendor/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        console.log("Fetched vendor order successfully:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching vendor order:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while fetching vendor order.";
    }
};


  export const updateVendorOrderStatus = async (orderId, status) => {
    try {
      const authToken = localStorage.getItem("vendorToken");
      if (!authToken) {
        throw new Error("Unauthorized: No vendor token found!");
      }

      const response = await api.put(`/api/vendor/orders/${orderId}/status`, 
        { status },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Updated vendor order status successfully:", response.data);
      return response.data;

    } catch (error) {
      console.error("Error updating vendor order status:", error.response?.data || error.message);
      throw error.response?.data?.message || "Something went wrong while updating vendor order status.";
    }
  };