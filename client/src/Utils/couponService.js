import api from './BaseApi.js';

export const fetchCoupons = async (page = 1, limit = 10, status = "all", search = "") => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
        const authToken = localStorage.getItem("authToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }

        const response = await api.get(`/api/admin/all-coupons?page=${page}&limit=${limit}&userTimezone=${userTimezone}&search=${search}&status=${status}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        console.log("Fetched Coupons data:", response.data);
        
        return {
            coupons: response.data.coupons,
            totalCoupons: response.data.totalCoupons,
            totalPages: response.data.totalPages,
        };
    } catch (error) {
        console.error("Error fetching coupons:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while fetching coupons.";
    }
};

export const createCoupon = async (couponData) => {
    try {
        const authToken = localStorage.getItem("authToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }

        const response = await api.post("/api/admin/create-coupon", couponData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
        });

        return response.data; 
    } catch (error) {
        console.error("Error creating coupon:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while creating the coupon.";
    }
};

export const updateCouponStatus = async (couponId, statusData) => {
    try {
        const authToken = localStorage.getItem("authToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }

        const response = await api.put(`/api/admin/edit-coupon-status/${couponId}`, statusData,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`, 
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Error updating coupon status:", error);
        throw error; 
    }
};

export const deleteCoupon = async (couponId) => {
    try {
        const authToken = localStorage.getItem("authToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }

        const response = await api.delete(`/api/admin/delete-coupon/${couponId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        return response.data; 
    } catch (error) {
        console.error("Error deleting coupon:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while deleting the coupon.";
    }
};

export const updateCoupon = async (couponId, couponData) => {
    try {
        const authToken = localStorage.getItem("authToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }

        const response = await api.put(`/api/admin/update-coupon/${couponId}`, couponData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json", 
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating coupon:", error.response?.data || error.message);
        throw error.response?.data?.message || "Something went wrong while updating the brand.";
    }
};

export const checkCouponNameExists = async (couponCode) => {
    try {
        const authToken = localStorage.getItem("authToken");
        if(!authToken) {
            throw new Error("Unauthorized: No token found!");
        }

        const response = await api.get(`/api/admin/check-coupon-name/${couponCode}`, {
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
