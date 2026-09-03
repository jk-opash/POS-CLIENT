import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Determine base URL (could use env var)
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pos-backend-qcky.onrender.com/api";

export const fetchPublicMenu = createAsyncThunk(
  "publicMenu/fetchPublicMenu",
  async (tableId, { rejectWithValue }) => {
    try {
      // Using direct axios instance without auth interceptor just in case
      const response = await axios.get(
        `${API_URL}/public/menu?tableId=${tableId}`,
      );
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.error || "Failed to load menu");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Network error. Please try again.",
      );
    }
  },
);

export const fetchTableActiveOrders = createAsyncThunk(
  "publicMenu/fetchTableActiveOrders",
  async (tableId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/public/order/${tableId}/active`,
      );
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to fetch active orders");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Network error. Please try again.",
      );
    }
  },
);

export const placePublicOrder = createAsyncThunk(
  "publicMenu/placePublicOrder",
  async ({ existingOrderId, orderData, kotData }, { rejectWithValue }) => {
    try {
      let orderId = existingOrderId;

      if (!orderId) {
        // 1. Create Order if it doesn't exist
        const createRes = await axios.post(`${API_URL}/public/order`, orderData);
        orderId = createRes.data.data.id;
      }

      // 2. Update with KOT
      const kotRes = await axios.put(
        `${API_URL}/public/order/${orderId}/kot`,
        kotData,
      );

      return kotRes.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          "Failed to place order. Please try again.",
      );
    }
  },
);

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const publicMenuSlice = createSlice({
  name: "publicMenu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPublicMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default publicMenuSlice.reducer;
