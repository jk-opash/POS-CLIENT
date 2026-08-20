import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const fetchAuditLogs = createAsyncThunk(
  'auditLog/fetchAuditLogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { branchId, type, severity, startDate, endDate } = params;
      let url = '/audit-logs?';
      if (branchId) url += `branch_id=${branchId}&`;
      if (type && type !== 'All') url += `type=${type}&`;
      if (severity) url += `severity=${severity}&`;
      if (startDate) url += `startDate=${startDate}&`;
      if (endDate) url += `endDate=${endDate}&`;
      
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch audit logs'
      );
    }
  }
);

const initialState = {
  logs: [],
  loading: false,
  error: null,
};

const auditLogSlice = createSlice({
  name: 'auditLog',
  initialState,
  reducers: {
    clearAuditLogError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload || [];
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAuditLogError } = auditLogSlice.actions;

export default auditLogSlice.reducer;
