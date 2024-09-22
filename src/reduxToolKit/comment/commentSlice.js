import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchLikesCommentFromApi } from "./../../service/apiAxios";

// Fetch likes for comments
export const fetchLikesCountComment = createAsyncThunk(
  "likes/fetchLikesComment",
  async (postIds) => {
    const response = await fetchLikesCommentFromApi(postIds);
    return response; // Ensure this is the array of like objects
  }
);

const likesSliceComment = createSlice({
  name: "likes",
  initialState: {
    totalLikes: [], // Initial state as an empty array
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // This should reference the thunk action, not the slice
    builder.addCase(fetchLikesCountComment.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        state.totalLikes = action.payload;
      } else {
        console.error("Unexpected payload format:", action.payload);
      }
    });
  },
});

export default likesSliceComment.reducer;
