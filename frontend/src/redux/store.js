import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import { sellerReducer } from "./reducers/seller";

const Store = configureStore({
  reducer: {
    user: userReducer,
    selller: sellerReducer,
  },
});

export default Store;
