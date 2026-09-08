import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  success: false,
  product: null,
  error: null,
};

export const productReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("productCreateRequest", (state) => {
      state.isLoading = true;
      state.success = false;
    })
    .addCase("productCreateSuccess", (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
      state.success = true;
      state.error = null;
    })
    .addCase("productCreateFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })


    // get all products of shop
    .addCase("getAllProductsShopRequest",(state)=>{
        state.isLoading = true;
    })
    .addCase("getAllProductsShopSuccess", (state,action)=>{
        state.isLoading = false;
        state.products = action.payload;
    })
    .addCase("getAllproductsShopFailed",(state,action)=>{
        state.isLoading = false;
        state.error = action.payload;
    })

    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
