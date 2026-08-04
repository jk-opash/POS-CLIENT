import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

// Async thunks
export const fetchTeamMembers = createAsyncThunk(
  'teamMember/fetchTeamMembers',
  async (businessId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/team-member?businessId=${businessId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch team members'
      );
    }
  },
  {
    condition: (businessId, { getState }) => {
      const { teamMember } = getState();
      if (teamMember?.loading || teamMember?.hasFetched) {
        return false;
      }
    }
  }
);

export const createTeamMember = createAsyncThunk(
  'teamMember/createTeamMember',
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
      
      const response = await api.post('/team-member', payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to create team member'
      );
    }
  }
);

export const deleteTeamMember = createAsyncThunk(
  'teamMember/deleteTeamMember',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/team-member/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to delete team member'
      );
    }
  }
);

export const updateTeamMember = createAsyncThunk(
  'teamMember/updateTeamMember',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/team-member/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to update team member'
      );
    }
  }
);

export const fetchTeamMemberById = createAsyncThunk(
  'teamMember/fetchTeamMemberById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/team-member/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch team member details'
      );
    }
  },
  {
    condition: (id, { getState }) => {
      const { teamMember } = getState();
      if (teamMember?.loading) {
        return false;
      }
    }
  }
);

const initialState = {
  teamMembers: [],
  currentTeamMember: null,
  loading: false,
  error: null,
  hasFetched: false,
};

const teamMemberSlice = createSlice({
  name: 'teamMember',
  initialState,
  reducers: {
    clearTeamMemberError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Team Members
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.teamMembers = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Team Member
      .addCase(createTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        state.teamMembers.push(action.payload);
      })
      .addCase(createTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Team Member
      .addCase(deleteTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        state.teamMembers = state.teamMembers.filter(member => member.id !== action.payload);
      })
      .addCase(deleteTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Team Member
      .addCase(updateTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.teamMembers.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.teamMembers[index] = action.payload;
        }
      })
      .addCase(updateTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Team Member By Id
      .addCase(fetchTeamMemberById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMemberById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTeamMember = action.payload;
      })
      .addCase(fetchTeamMemberById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTeamMemberError } = teamMemberSlice.actions;

export default teamMemberSlice.reducer;
