import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

// Async thunks
export const fetchBranches = createAsyncThunk(
  'branch/fetchBranches',
  async (businessId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/branch?businessId=${businessId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch branches'
      );
    }
  },
  {
    condition: (businessId, { getState }) => {
      const { branch } = getState();
      if (branch.loading || branch.hasFetched) {
        return false;
      }
    }
  }
);

export const createBranch = createAsyncThunk(
  'branch/createBranch',
  async (data, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const businessId = auth.user?.businesses?.[0]?.id;
      if (!businessId) {
        throw new Error("No business associated with this account.");
      }

      const payload = { 
        ...data, 
        business_id: businessId 
      };
      
      if (payload.capacity === "") payload.capacity = null;
      if (payload.tables_count === "") payload.tables_count = null;
      
      const response = await api.post('/branch', payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to create branch'
      );
    }
  }
);

export const fetchBranchById = createAsyncThunk(
  'branch/fetchBranchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/branch/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch branch details'
      );
    }
  }
);

export const updateBranch = createAsyncThunk(
  'branch/updateBranch',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/branch/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to update branch'
      );
    }
  }
);

export const deleteBranch = createAsyncThunk(
  'branch/deleteBranch',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/branch/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to delete branch'
      );
    }
  }
);

const initialState = {
  branches: [],
  currentBranch: null,
  loading: false,
  error: null,
  hasFetched: false,
};

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    clearBranchError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Branches
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Branch By Id
      .addCase(fetchBranchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranchById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBranch = action.payload;
      })
      .addCase(fetchBranchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Branch
      .addCase(createBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches.push(action.payload);
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Branch
      .addCase(updateBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBranch = action.payload;
        // Also update in branches array if it exists
        const index = state.branches.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Branch
      .addCase(deleteBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentBranch?.id === action.payload) {
          state.currentBranch = null;
        }
        state.branches = state.branches.filter(b => b.id !== action.payload);
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBranchError } = branchSlice.actions;

export default branchSlice.reducer;
