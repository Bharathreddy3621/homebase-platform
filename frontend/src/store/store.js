import { configureStore } from "@reduxjs/toolkit";

import { airbnbApi } from "./apiSlice";

export const store = configureStore({
  reducer: {
    [airbnbApi.reducerPath]: airbnbApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(airbnbApi.middleware),
});
