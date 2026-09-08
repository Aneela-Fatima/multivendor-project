import axios from "axios";
import { server } from "../../server";

// crreate product
export const createProduct = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "productCreateRequest",
    });

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.post(
      `${server}/product/create-product`,
      newForm,
      config,
    );
    dispatch({
      type: "productCreateSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "productCreateFail",
      payload: error.response.data.message,
    });
  }
};


// get all products
export const getAllProductsShop = () => async(dispatch)=>{
  try{
    dispatch({
      type: "getAllProductsShopRequest";
    });

    const {data} = await axios.get(`${server}/product/get-all-products-shop/${id}`);
    dispatch({
      type: "getAllproductsShopSuccess",
      payload: data.products,
    })
  }catch(error){
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response.data.message,
    });
  }
}