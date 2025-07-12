import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../lib/axios";

// --- USER MANAGEMENT ---
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return userId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- EVENT MANAGEMENT ---
export const fetchAllEvents = createAsyncThunk(
  "admin/fetchAllEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/admin/events", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createEvent = createAsyncThunk(
  "admin/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      // CORRECTED: Pass eventData as the request body
      const response = await apiClient.post("/admin/events", eventData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateEvent = createAsyncThunk(
  "admin/updateEvent",
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/admin/events/${id}`, eventData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "admin/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return eventId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const seedEventsFromCalendarific = createAsyncThunk(
  "admin/seedEvents",
  async (_, { rejectWithValue }) => {
    try {
      // CORRECTED: Pass an empty object as the body for POST requests
      const response = await apiClient.post(
        "/admin/events/seed",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- NOTIFICATIONS & TOKENS ---
export const sendNotification = createAsyncThunk(
  "admin/sendNotification",
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/admin/notify", notificationData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTokensToUser = createAsyncThunk(
  "admin/addTokensToUser",
  async ({ userId, tokens }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(
        `/admin/users/${userId}/add-tokens`,
        { tokens }, // Request body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    events: [],
    loading: false, // For initial data fetching
    isSubmitting: false, // For form submissions/actions
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // User Reducers
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      })

      // Event Reducers
      .addCase(fetchAllEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e._id !== action.payload);
      })

      // Action Reducers (Notifications, Tokens, Seeding)
      .addCase(seedEventsFromCalendarific.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(seedEventsFromCalendarific.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(seedEventsFromCalendarific.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload.message;
      })
      .addCase(sendNotification.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(sendNotification.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload.message;
      })
      .addCase(addTokensToUser.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(addTokensToUser.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(addTokensToUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload.message;
      });
  },
});

export default adminSlice.reducer;
