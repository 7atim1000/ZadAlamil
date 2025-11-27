import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducer/userReducer";
import loadReducer from './reducer/loaderSlice';
import authReducer from './reducer/authSlice';
import authVendor from './reducer/authVendorSlice';

const store = configureStore({
  reducer: {
    user: userReducer, 
    loader: loadReducer,
    auth: authReducer,
    vendor: authVendor,
  },
});

export default store;
