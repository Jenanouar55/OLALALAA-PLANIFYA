import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../lib/axios";

export const createCheckoutSession = createAsyncThunk(
  "stripe/createCheckoutSession",
  async ({ planId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/stripe/create-checkout-session", {
        planId,
      });
      return response.data.url;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const stripeSlice = createSlice({
  name: "stripe",
  initialState: {
    checkoutUrl: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutUrl = action.payload;
        window.location.href = action.payload;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export default stripeSlice.reducer;
