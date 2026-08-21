import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const fetchSupportTickets = createAsyncThunk(
  'supportTicket/fetchSupportTickets',
  async (params, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
      if (params?.priority && params.priority !== 'all') queryParams.append('priority', params.priority);
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await api.get(`/support-ticket${queryString}`);
      
      // Backend returns an array directly: res.data or res.data.data
      const dataArray = Array.isArray(response.data) ? response.data : (response.data.data || []);

      const mappedTickets = dataArray.map((ticket) => ({
        id: ticket.id,
        ticketNumber: ticket.ticket_number,
        businessId: ticket.business_id,
        businessName: ticket.business?.name || 'Unknown Business',
        branchName: ticket.branch?.name,
        contactPerson: ticket.business?.name || 'Unknown Contact',
        contactEmail: ticket.business?.email || 'unknown@example.com',
        subject: ticket.subject,
        description: ticket.description || '',
        category: ticket.category || 'technical',
        status: ticket.status,
        priority: ticket.priority,
        slaBreached: ticket.sla_breached,
        csatScore: ticket.csat_score ? parseFloat(ticket.csat_score) : undefined,
        resolutionTimeHrs: ticket.resolution_time_hrs ? parseFloat(ticket.resolution_time_hrs) : undefined,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at,
      }));
      
      return mappedTickets;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch support tickets');
    }
  }
);

export const createSupportTicket = createAsyncThunk(
  'supportTicket/createSupportTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await api.post('/support-ticket', ticketData);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create support ticket');
    }
  }
);

const initialState = {
  tickets: [],
  loading: false,
  error: null,
};

const supportTicketSlice = createSlice({
  name: 'supportTicket',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupportTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupportTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchSupportTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSupportTicket.fulfilled, (state, action) => {
        // Optionally append the new ticket or let the fetch re-trigger
      });
  },
});

export default supportTicketSlice.reducer;
