import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const fetchDashboardAnalytics = createAsyncThunk(
  'analytics/fetchDashboardAnalytics',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { branchId, timeRange } = params;
      let url = '/analytics/dashboard?';
      if (branchId) url += `branch_id=${branchId}&`;
      if (timeRange) url += `timeRange=${timeRange}&`;
      
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch analytics'
      );
    }
  }
);

const initialState = {
  stats: null,
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAnalyticsError } = analyticsSlice.actions;

export default analyticsSlice.reducer;
