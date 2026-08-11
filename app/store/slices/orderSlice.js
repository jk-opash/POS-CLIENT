import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const fetchPendingOrders = createAsyncThunk(
  'order/fetchPendingOrders',
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/order?branch_id=${branchId}&status=Pending`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch pending orders');
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'order/fetchAllOrders',
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/order?branch_id=${branchId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch all orders');
    }
  }
);

export const updateKDSItemStatus = createAsyncThunk(
  'order/updateKDSItemStatus',
  async ({ orderId, kotNumber, itemId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/order/${orderId}/kds`, {
        kotNumber,
        itemId,
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update item status');
    }
  }
);

export const updateKDSOrderStatus = createAsyncThunk(
  'order/updateKDSOrderStatus',
  async ({ orderId, kotNumber, itemIds, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/order/${orderId}/kds`, {
        kotNumber,
        itemIds,
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update order status');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    pendingOrders: [],
    allOrders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingOrders = action.payload;
      })
      .addCase(fetchPendingOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
