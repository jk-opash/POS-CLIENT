import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

// Fetch zones for a branch
export const fetchZones = createAsyncThunk(
  "zone/fetchZones",
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/zone?branch_id=${branchId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch zones"
      );
    }
  }
);

// Create a zone
export const createZone = createAsyncThunk(
  "zone/createZone",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/zone", data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create zone"
      );
    }
  }
);

// Update a zone
export const updateZone = createAsyncThunk(
  "zone/updateZone",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/zone/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update zone"
      );
    }
  }
);

// Delete a zone
export const deleteZone = createAsyncThunk(
  "zone/deleteZone",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/zone/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete zone"
      );
    }
  }
);

// Fetch tables for a zone
export const fetchTables = createAsyncThunk(
  "zone/fetchTables",
  async (zoneId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/table?zone_id=${zoneId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch tables"
      );
    }
  }
);

// Create a table
export const createTable = createAsyncThunk(
  "zone/createTable",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/table", data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create table"
      );
    }
  }
);

// Update table position / details
export const updateTable = createAsyncThunk(
  "zone/updateTable",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/table/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update table"
      );
    }
  }
);

// Delete table
export const deleteTable = createAsyncThunk(
  "zone/deleteTable",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/table/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete table"
      );
    }
  }
);

const initialState = {
  zones: [],
  tables: [],
  loading: false,
  error: null,
};

const zoneSlice = createSlice({
  name: "zone",
  initialState,
  reducers: {
    clearZoneState: (state) => {
      state.zones = [];
      state.tables = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchZones
      .addCase(fetchZones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchZones.fulfilled, (state, action) => {
        state.loading = false;
        state.zones = action.payload;
      })
      .addCase(fetchZones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createZone
      .addCase(createZone.fulfilled, (state, action) => {
        state.zones.push(action.payload);
      })
      // updateZone
      .addCase(updateZone.fulfilled, (state, action) => {
        const index = state.zones.findIndex(z => z.id === action.payload.id);
        if (index !== -1) {
          state.zones[index] = action.payload;
        }
      })
      // deleteZone
      .addCase(deleteZone.fulfilled, (state, action) => {
        state.zones = state.zones.filter(z => z.id !== action.payload);
      })
      // fetchTables
      .addCase(fetchTables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = action.payload;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createTable
      .addCase(createTable.fulfilled, (state, action) => {
        state.tables.push(action.payload);
        
        // Also add to the respective zone's tables array if nested
        const zone = state.zones.find(z => z.id === action.payload.zone_id);
        if (zone) {
          if (!zone.tables) zone.tables = [];
          zone.tables.push(action.payload);
        }
      })
      // updateTable
      .addCase(updateTable.fulfilled, (state, action) => {
        const index = state.tables.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tables[index] = action.payload;
        }
        
        // Also update nested tables in zone
        const zone = state.zones.find(z => z.id === action.payload.zone_id);
        if (zone && zone.tables) {
          const tIndex = zone.tables.findIndex(t => t.id === action.payload.id);
          if (tIndex !== -1) {
            zone.tables[tIndex] = action.payload;
          }
        }
      })
      // deleteTable
      .addCase(deleteTable.fulfilled, (state, action) => {
        state.tables = state.tables.filter(t => t.id !== action.payload);
        
        // Remove from nested tables
        state.zones.forEach(zone => {
          if (zone.tables) {
            zone.tables = zone.tables.filter(t => t.id !== action.payload);
          }
        });
      });
  },
});

export const { clearZoneState } = zoneSlice.actions;
export default zoneSlice.reducer;
