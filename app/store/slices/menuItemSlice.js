import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

// Fetch Menu Items
export const fetchMenuItems = createAsyncThunk(
  'menuItem/fetchMenuItems',
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/menu/items/branch/${branchId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch menu items'
      );
    }
  },
  {
    condition: (branchId, { getState }) => {
      const { menuItem } = getState();
      if (menuItem.loading) {
        return false;
      }
    }
  }
);

// Create Menu Item
export const createMenuItem = createAsyncThunk(
  'menuItem/createMenuItem',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/menu/items', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to create menu item'
      );
    }
  }
);

// Update Menu Item
export const updateMenuItem = createAsyncThunk(
  'menuItem/updateMenuItem',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/menu/items/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to update menu item'
      );
    }
  }
);

// Delete Menu Item
export const deleteMenuItem = createAsyncThunk(
  'menuItem/deleteMenuItem',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/menu/items/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to delete menu item'
      );
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const menuItemSlice = createSlice({
  name: 'menuItem',
  initialState,
  reducers: {
    clearMenuItemError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items.push(action.payload);
        }
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.items.findIndex(i => i.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(i => i.id !== action.payload);
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMenuItemError } = menuItemSlice.actions;

export default menuItemSlice.reducer;
