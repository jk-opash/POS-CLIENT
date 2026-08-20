import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

// Fetch suppliers
export const fetchSuppliers = createAsyncThunk(
  "supplier/fetchSuppliers",
  async ({ businessId, status }, { rejectWithValue }) => {
    try {
      if (!businessId) return rejectWithValue("Business ID is required");
      let url = `/supplier?business_id=${businessId}`;
      if (status) {
        url += `&status=${status}`;
      }

      const response = await api.get(url);
      if (response.data) {
        return response.data.data;
      }
      return rejectWithValue("Failed to fetch suppliers");
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { supplier } = getState();
      if (supplier.loading) {
        return false;
      }
    },
  }
);

// Create supplier
export const createSupplier = createAsyncThunk(
  "supplier/createSupplier",
  async (supplierData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/supplier`, supplierData);
      if (response.data) {
        return response.data.data;
      }
      return rejectWithValue("Failed to create supplier");
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Update supplier
export const updateSupplier = createAsyncThunk(
  "supplier/updateSupplier",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/supplier/${id}`, data);
      if (response.data) {
        return response.data.data;
      }
      return rejectWithValue("Failed to update supplier");
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Soft delete supplier (Archive)
export const deleteSupplier = createAsyncThunk(
  "supplier/deleteSupplier",
  async (supplierId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/supplier/${supplierId}`);
      if (response.data) {
        return supplierId;
      }
      return rejectWithValue("Failed to delete supplier");
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const supplierSlice = createSlice({
  name: "supplier",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateSupplier.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete (Archived in backend, but we can remove it from active UI list or update its status)
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i.id === action.payload);
        if (index !== -1) {
          state.items[index].status = "Archived";
        }
      });
  },
});

export default supplierSlice.reducer;
