import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

export const fetchExpenses = createAsyncThunk(
  "expense/fetchExpenses",
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/expense?branch_id=${branchId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch expenses");
    }
  }
);

export const createExpense = createAsyncThunk(
  "expense/createExpense",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/expense", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to create expense");
    }
  }
);

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    expenses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload);
      });
  },
});

export default expenseSlice.reducer;
