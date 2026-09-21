import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  isSeller: false,
};

export const sellerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("LoadSellerRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("LoadSellerSuccess", (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.isSeller = true;
      state.seller = action.payload;
    })
    .addCase("LoadSellerFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isSeller = false;
    })


    // Get all sellers (Admin)
    .addCase("getAllSellersRequest", (state) => {
      state.sellersLoading = true;
      state.sellersError = null;
    })
    .addCase("getAllSellersSuccess", (state, action) => {
      state.sellersLoading = false;
      state.sellers = action.payload;
      state.sellersError = null;
    })
    .addCase("getAllSellerFailed", (state, action) => {
      state.sellersLoading = false;
      state.sellersError = action.payload;
    })

    
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
