import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

export const fetchUtilityBills = createAsyncThunk(
  "utilityBill/fetchUtilityBills",
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/utility-bill?branch_id=${branchId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch utility bills");
    }
  }
);

export const createUtilityBill = createAsyncThunk(
  "utilityBill/createUtilityBill",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/utility-bill", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to create utility bill");
    }
  }
);

const utilityBillSlice = createSlice({
  name: "utilityBill",
  initialState: {
    bills: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUtilityBills.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUtilityBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload;
      })
      .addCase(fetchUtilityBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUtilityBill.fulfilled, (state, action) => {
        state.bills.unshift(action.payload);
      });
  },
});

export default utilityBillSlice.reducer;
