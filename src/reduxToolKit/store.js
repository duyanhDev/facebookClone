import { configureStore } from "@reduxjs/toolkit";
import likesReducer from "./like/likesSlice";

const store = configureStore({
  reducer: {
    likes: likesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable state invariant middleware
    }),
});

export default store;
