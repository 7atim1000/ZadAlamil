import api from './BaseApi.js';

export const fetchBanners = async (page = 1, limit = 10, status = "all", search = "") => {
    try {
        const authToken = localStorage.getItem("authToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }

      const response = await api.get(`/api/admin/get-all-banners?page=${page}&limit=${limit}&search=${search}&status=${status}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("Fetched banners data:", response.data);
      return {
        banners: response.data.banners,
        totalBanners: response.data.totalBanners,
        totalPages: response.data.totalPages,
    };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  export const createBanner = async (bannerData) => {

    try {
        const authToken = localStorage.getItem("authToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        
        const response = await api.post('/api/admin/create-banner', bannerData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response.data; 
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateBannerStatus = async (bannerId, statusData) => {
    try {
        const authToken = localStorage.getItem("authToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        const response = await api.put(`/api/admin/edit-banner-status/${bannerId}`, statusData,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`, 
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Error updating banne status:", error);
        throw error; 
    }
};

export const deleteBanner = async (bannerId) => {
    try {
        const authToken = localStorage.getItem("authToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }
        const response = await api.delete(`/api/admin/delete-banner/${bannerId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        return response.data; 
    } catch (error) {
        console.error("Error deleting banner:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while deleting the banner.";
    }
};

export const updateBanner = async (bannerId, bannerData) => {
    try {
        const authToken = localStorage.getItem("authToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }

        const formData = new FormData();
        formData.append("name", bannerData.name);
        if (bannerData.bannerImage) {
            formData.append("logo", bannerData.bannerImage); 
        }

        const response = await api.put(`/api/admin/edit-banner/${bannerId}`, formData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "multipart/form-data",  
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating banner:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while updating the banner.";
    }
};

export const checkBannerNameExists = async (bannerName) => {
    try {
        const authToken = localStorage.getItem("authToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }

        const response = await api.get(`/api/admin/check-banner-name/${bannerName}`, {
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
