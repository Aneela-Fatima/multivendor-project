import axios from "axios";
import { server } from "../../server";

// load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoaduserRequest",
    });
    const response = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
      validateStatus: (status) => status < 500,
    });
    if (response.status !== 200 || !response.data?.user) {
      dispatch({ type: "LoadUserFail", payload: null });
      return;
    }
    dispatch({
      type: "LoadUserSuccess",
      payload: response.data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response?.data?.message || "",
    });
  }
};

// load seller
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadSellerRequest",
    });
    const response = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
      validateStatus: (status) => status < 500,
    });
    if (response.status !== 200 || !response.data?.seller) {
      dispatch({ type: "LoadSellerFail", payload: null });
      return;
    }
    dispatch({
      type: "LoadSellerSuccess",
      payload: response.data.seller,
    });
  } catch (error) {
    dispatch({
      type: "LoadSellerFail",
      payload: error.response?.data?.message || "",
    });
  }
};

// update user information
export const updateUserInformation =
  ({ name, email, phoneNumber, password }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: "updateUserInfoRequest",
      });

      const { data } = await axios.put(
        `${server}/user/update-user-info`,
        {
          name,
          email,
          phoneNumber,
          password,
        },
        {
          withCredentials: true,
        },
      );

      dispatch({
        type: "updateUserInfoSuccess",
        payload: data.user,
      });
    } catch (error) {
      dispatch({
        type: "updateUserInfoFailed",
        payload: error.response?.data?.message || "Something went wrong",
      });
    }
  };

// update user address
export const updateUserAddress =
  (country, city, address1, address2, zipCode, addressType) => async (dispatch) => {
    try {
      dispatch({
        type: "updateUserAddressRequest",
      });

      const { data } = await axios.put(
        `${server}/user/update-user-addresses`,
        {
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType,
        },
        { withCredentials: true },
      );

      dispatch({
        type: "updateUserAddressSuccess",
        payload: {
          updateAddressSuccessMessage: "User address updated successfully",
          user: data.user,
        },
      });
    } catch (error) {
      dispatch({
        type: "updateUserAddressFailed",
        payload: error?.response?.data?.message || "Failed to save address",
      });
    }
  };

  // delete user address
 export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteUserAddressRequest",
    });

    const { data } = await axios.delete(`${server}/user/delete-user-address/${id}`, {withCredentials: true});

    dispatch({
      type: "deleteUserAddressSuccess",
      payload: {
        successMessage: "Address deleted succesfully!",
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: "deleteUserAddressFailed",
      payload: error.response.data.message,
    });
  }
}

// Get all users (Admin only)
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllUsersRequest" });

    const { data } = await axios.get(`${server}/user/admin-all-users`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllUsersSuccess",
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: "getAllUsersFailed",
      payload: error.response?.data?.message || "Failed to fetch users",
    });
  }
};