import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

// Async thunk to fetch inventory items
export const fetchInventoryItems = createAsyncThunk(
  'inventory/fetchInventoryItems',
  async ({ branchId }, { rejectWithValue }) => {
    try {
      if (!branchId) return rejectWithValue('Branch ID is required');
      const url = `/inventory/items/branch/${branchId}`;
        
      const response = await api.get(url);
      if (response.data.success) {
        // Map the backend data to match frontend structure expectations
        return response.data.data.map(item => {
          return {
            id: item.id,
            name: item.name,
            sku: item.sku,
            category: item.category || 'Uncategorized',
            currentStock: Number(item.in_stock),
            inStock: Number(item.in_stock),
            cost: Number(item.price) || 0,
            reorderLevel: Number(item.reorder_level) || 0,
            status: item.status || 'Normal'
          }
        });
      }
      return rejectWithValue('Failed to fetch inventory items');
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
  {
    condition: ({ branchId }, { getState }) => {
      const { inventory } = getState();
      if (inventory.loading || !branchId) {
        return false;
      }
    },
  }
);

// Create item
export const createInventoryItem = createAsyncThunk(
  'inventory/createInventoryItem',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/inventory/items`, itemData);
      if (response.data.success) {
        const item = response.data.data;
        return {
          id: item.id,
          name: item.name,
          sku: item.sku,
          category: item.category || 'Uncategorized',
          currentStock: Number(item.in_stock),
          inStock: Number(item.in_stock),
          cost: Number(item.price) || 0,
          reorderLevel: Number(item.reorder_level) || 0,
          status: item.status || 'Normal'
        };
      }
      return rejectWithValue('Failed to create item');
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Delete item
export const deleteInventoryItem = createAsyncThunk(
  'inventory/deleteInventoryItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/inventory/items/${itemId}`);
      if (response.data.success) {
        return itemId;
      }
      return rejectWithValue('Failed to delete item');
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Adjust stock
export const adjustInventoryStock = createAsyncThunk(
  'inventory/adjustInventoryStock',
  async ({ item_id, quantity_change, movement_type = "ADJUSTMENT", reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/inventory/stock/adjust`, {
        item_id,
        quantity_change,
        movement_type,
        reason
      });
      if (response.data.success) {
        return response.data.data; // { item, new_stock, status }
      }
      return rejectWithValue('Failed to adjust stock');
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Update item
export const updateInventoryItem = createAsyncThunk(
  'inventory/updateInventoryItem',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/inventory/items/${id}`, data);
      if (response.data.success) {
        const item = response.data.data;
        return {
          id: item.id,
          name: item.name,
          sku: item.sku,
          category: item.category || 'Uncategorized',
          currentStock: Number(item.in_stock),
          inStock: Number(item.in_stock),
          cost: Number(item.price) || 0,
          reorderLevel: Number(item.reorder_level) || 0,
          status: item.status || 'Normal'
        };
      }
      return rejectWithValue('Failed to update item');
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInventoryItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // create item
      .addCase(createInventoryItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // update item
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // delete item
      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      })
      // adjust stock
      .addCase(adjustInventoryStock.fulfilled, (state, action) => {
        const { item, new_stock, status } = action.payload;
        const index = state.items.findIndex(i => i.id === item.id);
        if (index !== -1) {
          state.items[index].currentStock = Number(new_stock);
          state.items[index].inStock = Number(new_stock);
          state.items[index].status = status;
        }
      });
  },
});

export default inventorySlice.reducer;
