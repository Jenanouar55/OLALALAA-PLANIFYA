import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chatStrategy } from "./aiSlice";
import apiClient from "../lib/axios";

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/chat/conversations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(
        `/chat/conversations/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { conversationId, messages: data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteConversation = createAsyncThunk(
  "chat/deleteConversation",
  async (conversationId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/chat/conversations/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return conversationId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const renameConversation = createAsyncThunk(
  "chat/renameConversation",
  async ({ conversationId, title }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(
        `/chat/conversations/${conversationId}`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    activeConversationMessages: [],
    activeConversationId: null,
    loading: {
      conversations: false,
      messages: false,
      action: false,
    },
    error: null,
  },
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
      if (action.payload === null) {
        state.activeConversationMessages = [];
      }
    },
    clearChatState: (state) => {
      state.conversations = [];
      state.activeConversationMessages = [];
      state.activeConversationId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading.conversations = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading.conversations = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading.conversations = false;
        state.error = action.payload?.message;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading.messages = true;
        state.activeConversationMessages = [];
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading.messages = false;
        state.activeConversationMessages = action.payload.messages;
        state.activeConversationId = action.payload.conversationId;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading.messages = false;
        state.error = action.payload?.message;
      })
      .addCase(deleteConversation.pending, (state) => {
        state.loading.action = true;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.loading.action = false;
        const deletedId = action.payload;
        state.conversations = state.conversations.filter(
          (c) => c._id !== deletedId
        );
        if (state.activeConversationId === deletedId) {
          const nextConversation =
            state.conversations.length > 0 ? state.conversations[0] : null;
          state.activeConversationId = nextConversation
            ? nextConversation._id
            : null;
          state.activeConversationMessages = [];
        }
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.loading.action = false;
        state.error = action.payload?.message;
      })
      .addCase(renameConversation.pending, (state) => {
        state.loading.action = true;
      })
      .addCase(renameConversation.fulfilled, (state, action) => {
        state.loading.action = false;
        const index = state.conversations.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.conversations[index].title = action.payload.title;
        }
      })
      .addCase(renameConversation.rejected, (state, action) => {
        state.loading.action = false;
        state.error = action.payload?.message;
      })
      .addCase(chatStrategy.fulfilled, (state, action) => {
  const { result, conversationId } = action.payload;
  const userMessage = action.meta.arg.message;

  const userMsgObj = {
    role: "user",
    message: userMessage,
    createdAt: new Date().toISOString(),
  };
  const assistantMsgObj = {
    role: "assistant",
    message: result,
    createdAt: new Date().toISOString(),
  };

  // 🔥 IMMUTABLY replace the messages array
  state.activeConversationMessages = [
    ...state.activeConversationMessages,
    userMsgObj,
    assistantMsgObj,
  ];

  // Set active conversation if it's new
  const isNew = !state.conversations.some((c) => c._id === conversationId);
  if (isNew) {
    const newConversationTitle =
      userMessage.substring(0, 30) + (userMessage.length > 30 ? "..." : "");
    state.conversations.unshift({
      _id: conversationId,
      title: newConversationTitle,
      createdAt: new Date().toISOString(),
    });
    state.activeConversationId = conversationId;
  }
});

  },
});

export const { setActiveConversation, clearChatState } = chatSlice.actions;
export default chatSlice.reducer;
