import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

export const fetchReconciliations = createAsyncThunk(
  "reconciliation/fetchReconciliations",
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reconciliation?branch_id=${branchId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch reconciliations");
    }
  }
);

export const uploadSettlement = createAsyncThunk(
  "reconciliation/uploadSettlement",
  async (data, { rejectWithValue }) => {
    try {
      // Assuming a generic form data or JSON post
      const response = await api.post("/reconciliation/upload", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to upload settlement");
    }
  }
);

const reconciliationSlice = createSlice({
  name: "reconciliation",
  initialState: {
    reconciliations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReconciliations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReconciliations.fulfilled, (state, action) => {
        state.loading = false;
        state.reconciliations = action.payload;
      })
      .addCase(fetchReconciliations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadSettlement.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadSettlement.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally refresh or append to list
      })
      .addCase(uploadSettlement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reconciliationSlice.reducer;
