import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../lib/axios";

export const fetchMyProfile = createAsyncThunk(
  "profile/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/profile/me", {
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

export const createOrUpdateProfile = createAsyncThunk(
  "profile/createOrUpdateProfile",
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { profile } = getState();
      if (profile.data) {
        const response = await apiClient.put("/profile/me", profileData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return response.data.profile;
      } else {
        const response = await apiClient.post("/profile", profileData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return response.data.profile;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.data = null;
      })
      .addCase(createOrUpdateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrUpdateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createOrUpdateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default profileSlice.reducer;
