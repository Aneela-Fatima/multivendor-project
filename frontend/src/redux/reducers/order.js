import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  adminOrderLoading: false,
  orders: [],
  adminOrders: [],
  error: null,
};

export const orderReducer = createReducer(initialState, (builder) => {
  builder
    //  Get User Orders
    .addCase("getAllOrdersUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("getAllOrdersUserSuccess", (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    })
    .addCase("getAllOrdersUserFailed", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Get Shop Orders
    .addCase("getAllOrdersShopRequest", (state) => {
      state.loading = true;
    })
    .addCase("getAllOrdersShopSuccess", (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    })
    .addCase("getAllOrdersShopFailed", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    //  Admin Orders
    .addCase("adminAllOrdersRequest", (state) => {
      state.adminOrderLoading = true;
    })
    .addCase("adminAllOrdersSuccess", (state, action) => {
      state.adminOrderLoading = false;
      state.adminOrders = action.payload;
    })
    .addCase("adminAllOrdersFailed", (state, action) => {
      state.adminOrderLoading = false;
      state.error = action.payload;
    })

    //  Clear Errors
    .addCase("clearOrdersErrors", (state) => {
      state.error = null;
    });
});