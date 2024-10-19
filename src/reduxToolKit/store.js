import { configureStore } from "@reduxjs/toolkit";
import likesReducer from "./like/likesSlice";
import commentReducer from "./comment/commentSlice"; // Rename import to match its function
import replyLikesSlice from "./likeReply/likesReplySlice";
const store = configureStore({
  reducer: {
    likes: likesReducer, // Likes reducer
    comments: commentReducer, // Correct key for comments
    replyLikes: replyLikesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable state invariant middleware
    }),
});

export default store;
