import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

export const fetchWithdrawals = createAsyncThunk(
  "withdrawal/fetchWithdrawals",
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/withdrawal?branch_id=${branchId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch withdrawals");
    }
  }
);

export const createWithdrawal = createAsyncThunk(
  "withdrawal/createWithdrawal",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/withdrawal", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to create withdrawal");
    }
  }
);

const withdrawalSlice = createSlice({
  name: "withdrawal",
  initialState: {
    withdrawals: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWithdrawals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWithdrawals.fulfilled, (state, action) => {
        state.loading = false;
        state.withdrawals = action.payload;
      })
      .addCase(fetchWithdrawals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createWithdrawal.fulfilled, (state, action) => {
        state.withdrawals.unshift(action.payload);
      });
  },
});

export default withdrawalSlice.reducer;
