import api from './BaseApi';

export const getAddresses = async () => {
    try {
      const authToken = localStorage.getItem("userAccessToken");
      if (!authToken) throw new Error("Unauthorized");

      const response = await api.get("/api/user/addresses/fetch", {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      console.log("Fetched user addresses successfully:", response.data);
      return response.data;

    } catch (error) {
      console.error("Error fetching addresses:", error);
      throw error.response?.data?.message || "Failed to fetch addresses";
    }
};

export const createAddress = async (addressData) => {
    try {
      const authToken = localStorage.getItem("userAccessToken");
      if (!authToken) throw new Error("Unauthorized");

      const response = await api.post("/api/user/addresses/add", addressData, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error("Error creating address:", error);
      throw error.response?.data?.message || "Failed to create address";
    }
};

export const  updateAddress = async (addressId, updateData) => {
    try {
      const authToken = localStorage.getItem("userAccessToken");
      if (!authToken) throw new Error("Unauthorized");

      const response = await api.put(`/api/user/addresses/update/${addressId}`, updateData, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error("Error updating address:", error);
      throw error.response?.data?.message || "Failed to update address";
    }
};


export const deleteAddress = async (addressId) => {
    try {
      const authToken = localStorage.getItem("userAccessToken");
      if (!authToken) throw new Error("Unauthorized");

      const response = await api.delete(`/api/user/addresses/remove/${addressId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      return response.data;
    } catch (error) {
      console.error("Error deleting address:", error);
      throw error.response?.data?.message || "Failed to delete address";
    }
};

export const setDefaultAddress = async (addressId) => {
    try {
      const authToken = localStorage.getItem("userAccessToken");
      if (!authToken) throw new Error("Unauthorized");

      const response = await api.put(`/api/user/addresses/${addressId}/set-default`, {}, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      return response.data;
    } catch (error) {
      console.error("Error setting default address:", error);
      throw error.response?.data?.message || "Failed to set default address";
    }
};