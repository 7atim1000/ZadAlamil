// userReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("userAccessToken") || "",
    user: JSON.parse(localStorage.getItem("user") || "{}"),
};

const singleUser = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.user = action.payload;
      try {
          localStorage.setItem("userDetails", JSON.stringify(action.payload));
      } catch (error) {
          console.error("Failed to save user details:", error);
      }
  },
  
    
    setTokens: (state, action) => {
      state.token = action.payload;
      try {
        localStorage.setItem("userAccessToken", action.payload);
      } catch (error) {
        console.log("Failed to save token to localStorage:", error);
      }
      console.log("token dispatched to Redux:::::::::::::::", action.payload);
    },
    
    logoutUser: (state) => {
      localStorage.removeItem("userAccessToken");
      localStorage.removeItem("user");
      state.user = {};
      state.token = "";
    },
  },
});
export const { setUserDetails, logoutUser, setTokens } = singleUser.actions;
export default singleUser.reducer;