import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

// Get user notifications
export const getUserNotifications = createAsyncThunk(
  "notifications/getUserNotifications",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      let url = `${API_URL}/notifications`;
      if (params.unreadOnly) {
        url += "?unreadOnly=true";
      }
      
      const { data } = await axios.get(url, config);
      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// Get unread count
export const getUnreadCount = createAsyncThunk(
  "notifications/getUnreadCount",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/notifications/unread/count`, config);
      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// Mark as read
export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.patch(`${API_URL}/notifications/${id}/read`, {}, config);
      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// Mark all as read
export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.patch(`${API_URL}/notifications/read/all`, {}, config);
      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Helper to safely get notifications
const getNotifications = (state) => state.notifications?.notifications || [];
const getUnreadCountValue = (state) => state.notifications?.unreadCount || 0;

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data || [];
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUnreadCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadCount = action.payload.count || 0;
      })
      .addCase(getUnreadCount.rejected, (state) => {
        state.loading = false;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = action.payload.data;
        state.notifications = state.notifications.map((n) =>
          n._id === notification._id ? notification : n
        );
        if (!notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      });
  },
});

export const { clearNotificationError, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

