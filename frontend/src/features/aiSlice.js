import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../lib/axios";

export const generateCaption = createAsyncThunk(
  "ai/generateCaption",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/ai/caption", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const generateContentIdeas = createAsyncThunk(
  "ai/generateContentIdeas",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/ai/calendar-ideas", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const generateScript = createAsyncThunk(
  "ai/generateScript",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/ai/script", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const chatStrategy = createAsyncThunk(
  "ai/chatStrategy",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/ai/strategy-chat", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    generatedContent: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearGeneratedContent: (state) => {
      state.generatedContent = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const addGenericCases = (thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.generatedContent = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state.generatedContent = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload.error;
        });
    };
    addGenericCases(generateCaption);
    addGenericCases(generateContentIdeas);
    addGenericCases(generateScript);
    addGenericCases(chatStrategy);
  },
});

export const { clearGeneratedContent } = aiSlice.actions;
export default aiSlice.reducer;
