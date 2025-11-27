import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../Utils/constants';

export const vendorLogin = createAsyncThunk(
    'auth/vendorLogin',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/vendor/login`, credentials);
            localStorage.setItem('vendorToken', response.data.token);  // Store token
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const vendorLogout = createAsyncThunk(
    'auth/vendorLogout',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('vendorToken');
            const response = await axios.post(
                `${BASE_URL}/api/vendor/logout`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            localStorage.removeItem('vendorToken');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        vendor: null,
        token: localStorage.getItem('vendorToken') || null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(vendorLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(vendorLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.vendor = action.payload;
                state.token = action.payload.token;
            })
            .addCase(vendorLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Login failed';
            })
            .addCase(vendorLogout.fulfilled, (state) => {
                state.vendor = null;
                state.token = null;
                state.loading = false;
                state.error = null;
            });
    },
});

export default authSlice.reducer;
