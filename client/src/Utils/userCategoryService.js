import api from './BaseUrl.js';
//import api from './BaseApi.js';

// const isTokenValid = (token) => {
//     try {
//         const decoded = JSON.parse(atob(token.split('.')[1])); 
//         return decoded.exp * 1000 > Date.now(); 
//     } catch (error) {
//         console.error("Invalid token format:", error);
//         return false;
//     }
// };

const isTokenValid = (token) => {
    try {
        // Parse the JWT token payload
        const payload = JSON.parse(atob(token.split('.')[1])); 
        
        // Check if token is expired
        // JWT exp is in seconds, Date.now() is in milliseconds
        const currentTime = Date.now() / 1000; // Convert to seconds
        return payload.exp > currentTime; 
        
    } catch (error) {
        console.error("Invalid token format:", error);
        return false;
    }
};

// Protected API:
export const getCategories = async (search = '') => {
    console.log("Making API call to get categories...");
    
    // Get the user token (not admin token)
    const token = localStorage.getItem("userAccessToken");

    if (!token) {
        console.error("No authentication token found.");
        throw new Error("No authentication token found.");
    }

    // Validate token
    if (!isTokenValid(token)) {
        console.error("Authentication token is invalid or expired.");
        localStorage.removeItem("userAccessToken"); // Remove user token, not authToken
        throw new Error("Authentication token is invalid or expired.");
    }

    try {
        // console.log("Sending request with token:", token.substring(0, 20) + "...");
        
        const response = await api.get(`/api/user/get-categories`, {
            params: { search },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        console.log("API response received:", response.data);
        return response.data;
        
    } catch (error) {
        console.error("API Error details:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        throw error.response?.data?.message || "Something went wrong";
    }
};

//Public API : 
  // Public API - no token required
  export const getCategoriesPublic = async (search = '') => {
    try {
        console.log("Making PUBLIC API call to get categories...");
        
        const response = await api.get(`/api/user/get-categories`, {
            params: { search }
        });
        
        console.log("Public categories API response received:", response.data);
        return response.data;
        
    } catch (error) {
        console.error("Public categories API Error:", error);
        throw error.response?.data?.message || "Something went wrong";
    }
};


// export const getCategories = async (search = '') => {
//     console.log("Making API call to get categories...");
//     //const token = localStorage.getItem("authToken");
   
//     const token = localStorage.getItem("userAccessToken");

//     if (!token) {
//         console.error("No authentication token found.");
//         throw new Error("No authentication token found.");
//     }

//     if (!isTokenValid(token)) {
//         console.error("Authentication token is invalid or expired.");
//         localStorage.removeItem("authToken");
//         throw new Error("Authentication token is invalid or expired.");
//     }

//     if (!token) {
//         throw new Error("No authentication token found");
//     }

//     try {
//         const response = await api.get(`/api/user/get-categories`, {
//             params: { search },
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         // return {
//         //     categories: response.categories,
//         //     totalCategories: response.totalCategories,
//         // };
//         return response.data;
//     } catch (error) {
//         throw error.response?.data?.message || "Something went wrong";
//     }
// };