import api from './BaseApi.js';

export const getProductsByCategory = async (categoryId, search = '') => {
  try {
    console.log(`Fetching products for category: ${categoryId}`);
    
    const response = await api.get(`/api/user/product/${categoryId}`, {
      params: { search }
    });
    
    console.log("Products by category response:", response.data);
    return response.data;
    
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error.response?.data?.message || "Something went wrong";
  }
};