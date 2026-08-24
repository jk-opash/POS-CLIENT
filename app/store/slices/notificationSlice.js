import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Determine the base API URL correctly for the client
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

// Fetch notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${API_URL}/notifications`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications",
      );
    }
  },
);

// Mark a single notification as read
export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.patch(
        `${API_URL}/notifications/${id}/read`,
        {},
        config,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark notification as read",
      );
    }
  },
);

// Mark all notifications as read
export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.patch(
        `${API_URL}/notifications/read-all`,
        {},
        config,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark all as read",
      );
    }
  },
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Action dispatched when a new socket event comes in
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;

        let fetchedItems = [];
        if (Array.isArray(action.payload)) {
          fetchedItems = action.payload;
        } else if (action.payload && Array.isArray(action.payload.data)) {
          fetchedItems = action.payload.data;
        } else if (
          action.payload &&
          Array.isArray(action.payload.notifications)
        ) {
          fetchedItems = action.payload.notifications;
        } else if (action.payload && Array.isArray(action.payload.items)) {
          fetchedItems = action.payload.items;
        } else if (action.payload && typeof action.payload === "object") {
          // If the backend returns a single object that isn't wrapped in an array but has a data property that's an object
          const possibleArray = Object.values(action.payload).find((val) =>
            Array.isArray(val),
          );
          if (possibleArray) fetchedItems = possibleArray;
        }

        state.items = fetchedItems;
        state.unreadCount = state.items.filter(
          (item) => !item.read && !item.is_read,
        ).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const id = action.meta.arg;
        const notification = state.items.find((item) => item.id === id);
        if (notification && !notification.read && !notification.is_read) {
          notification.read = true;
          notification.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items.forEach((item) => {
          item.read = true;
          item.is_read = true;
        });
        state.unreadCount = 0;
      });
  },
});

export const { addNotification, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
