import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchLikesFromApi } from "./../../service/apiAxios";

// Fetch likes for posts
export const fetchLikesCount = createAsyncThunk(
  "likes/fetchLikes",
  async (postIds) => {
    const response = await fetchLikesFromApi(postIds);
    return response; // Make sure this is the array of like objects
  }
);
const likesSlice = createSlice({
  name: "likes",
  initialState: {
    totalLikes: [], // Initial state as an empty array
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLikesCount.fulfilled, (state, action) => {
      // console.log("Fetch successful, action.payload:", action.payload);
      if (Array.isArray(action.payload)) {
        state.totalLikes = action.payload;
        // console.log("Updated totalLikes:", state.totalLikes);
      } else {
        console.error("Unexpected payload format:", action.payload);
      }
    });
  },
});

export default likesSlice.reducer;
