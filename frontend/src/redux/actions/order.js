import { axios } from "axios";
import {server} from "../../server";

//  Get all orders of user
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch({ type: "getAllOrdersUserRequest" });

    const { data } = await axios.get(
      `${server}/order/get-all-orders/${userId}`
    );

    dispatch({
      type: "getAllOrdersUserSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersUserFailed",
      payload: error.response?.data?.message || "Failed to fetch user orders",
    });
  }
};

//  Get all orders of shop/seller
export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
  try {
    dispatch({ type: "getAllOrdersShopRequest" });

    const { data } = await axios.get(
      `${server}/order/get-seller-all-orders/${shopId}`
    );

    dispatch({
      type: "getAllOrdersShopSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersShopFailed",
      payload: error.response?.data?.message || "Failed to fetch shop orders",
    });
  }
};

//  Get all orders for Admin
export const getAllOrdersOfAdmin = () => async (dispatch) => {
  try {
    dispatch({ type: "adminAllOrdersRequest" });

    const { data } = await axios.get(
      `/order/admin-all-orders`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "adminAllOrdersSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "adminAllOrdersFailed",
      payload: error.response?.data?.message || "Failed to fetch admin orders",
    });
  }
};

//  Clear errors
export const clearOrdersErrors = () => (dispatch) => {
  dispatch({ type: "clearOrdersErrors" });
};