import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchLikesReplyFromApi } from "./../../service/apiAxios";

// Fetch likes for replies
export const fetchLikesCountReply = createAsyncThunk(
  "replyLikes/fetchLikes",
  async (replyId) => {
    const response = await fetchLikesReplyFromApi(replyId);

    return response;
  }
);

const replyLikesSlice = createSlice({
  name: "replyLikes",
  initialState: {
    totalReply: [], // Store likes for replies
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLikesCountReply.fulfilled, (state, action) => {
      // console.log("Fetch successful, action.payload:", action.payload);
      if (Array.isArray(action.payload)) {
        state.totalReply = action.payload;
        // console.log("Updated totalLikes:", state.totalLikes);
      } else {
        console.error("Unexpected payload format:", action.payload);
      }
    });
  },
});

// Export the actions

// Export the reducer
export default replyLikesSlice.reducer;
