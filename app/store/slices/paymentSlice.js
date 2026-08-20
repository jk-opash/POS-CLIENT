import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

export const fetchPayments = createAsyncThunk(
  "payment/fetchPayments",
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/payment?branch_id=${branchId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch payments");
    }
  }
);

export const createPayment = createAsyncThunk(
  "payment/createPayment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/payment", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to create payment");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    payments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        const newArr = Array.isArray(state.payments) ? state.payments : state.payments?.data || [];
        state.payments = [action.payload, ...newArr];
      });
  },
});

export default paymentSlice.reducer;
