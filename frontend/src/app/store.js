// app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import postsReducer from "../features/postsSlice";
import profileReducer from "../features/profileSlice";
import adminReducer from "../features/adminSlice";
import aiReducer from "../features/aiSlice";
import stripeReducer from "../features/stripeSlice";
import notificationsReducer from "../features/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    profile: profileReducer,
    admin: adminReducer,
    ai: aiReducer,
    stripe: stripeReducer,
    notifications: notificationsReducer,
  },
});
