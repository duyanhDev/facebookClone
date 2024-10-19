import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchLikesReplyFromApi } from "./../../service/apiAxios";

// Fetch likes for replies
export const fetchLikesCountReply = createAsyncThunk(
  "replyLikes/fetchLikes",
  async (replyId) => {
    const response = await fetchLikesReplyFromApi(replyId);
    console.log("Fetched reply likes:", response);
    return response;
  }
);

const replyLikesSlice = createSlice({
  name: "replyLikes",
  initialState: {
    items: [], // Store likes for replies
    status: "idle",
    error: null,
  },
  reducers: {
    addLike: (state, action) => {
      const { replyId, userId, reaction } = action.payload;
      const reply = state.items.find((item) => item._id === replyId);
      if (reply) {
        reply.likes.push({ userId, reaction });
      }
    },
    removeLike: (state, action) => {
      const { replyId, userId } = action.payload;
      const reply = state.items.find((item) => item._id === replyId);
      if (reply) {
        reply.likes = reply.likes.filter((like) => like.userId !== userId);
      }
    },
    updateReplyLikes: (state, action) => {
      const { replyId, totalLikes } = action.payload;
      const reply = state.items.find((item) => item._id === replyId);
      if (reply) {
        reply.totalLikes = totalLikes;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikesCountReply.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLikesCountReply.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else {
          console.error(
            "Unexpected payload format for reply likes:",
            action.payload
          );
        }
      })
      .addCase(fetchLikesCountReply.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the actions
export const { addLike, removeLike } = replyLikesSlice.actions;

// Export the reducer
export default replyLikesSlice.reducer;
