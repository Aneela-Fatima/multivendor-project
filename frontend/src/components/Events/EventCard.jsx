import React from "react";
import styles from "../../styles/styles";
import CountDown from "./CountDown";
import { backend_url } from "../../server";
import { useSelector, useDispatch } from "react-redux";
import {Link} from "react-router-dom";
import { addToCart } from "../../redux/actions/cart";
import {toast} from "react-toastify";  

const EventCard = ({ active, data }) => {

  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  if (!data) {
    return (
      <div className="w-full rounded-xl bg-white p-5 text-center text-sm text-gray-500 shadow-sm border border-gray-100">
        No events available.
      </div>
    );
  }

  const imageUrl = data.images?.[0] ? `${backend_url}${data.images[0]}` : "";

  return (
    <div
      className={`w-full overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 ${active ? "unset" : "mb-12"} lg:flex`}
    >
      <div className="object-cover w-full lg:w-[48%] bg-[#f8fafc] p-4 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={data.name || "Event"}
            className="w-full max-h-[380px] object-cover rounded-xl"
          />
        ) : (
          <div className="flex h-[260px] w-full items-center justify-center rounded-xl bg-gray-200 text-gray-500">
            No image
          </div>
        )}
      </div>

      <div className="w-full lg:w-[52%] flex flex-col justify-center p-5 sm:p-7">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#eaf7ee] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1f9d55]">
            Limited Time
          </span>
          <span className="text-sm font-medium text-[#4b5563]">
            {data.sold_out || 0} sold
          </span>
        </div>

        <h2 className={`${styles.productTitle} mb-3 text-left`}>{data.name}</h2>
        <p className="mb-4 text-sm leading-6 text-gray-600">{data.description}</p>

        <div className="mb-5 flex items-end justify-between gap-3">
          <div className="flex items-center gap-3">
            {data.originalPrice ? (
              <h5 className="text-lg font-medium text-[#d55b45] line-through">
                ${data.originalPrice}
              </h5>
            ) : null}
            <h5 className="text-2xl font-bold text-[#111827]">
              ${data.discountPrice}
            </h5>
          </div>
        </div>

        <div className="rounded-xl bg-[#f9fafb] p-3 border border-gray-100">
          <CountDown data={data}/>
          <br/>
        </div>
        <div className="flex items-center">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <div className={`${styles.button} text-[#fff]`}>See Details</div>
          </Link>
          <div className={`${styles.button} text-[#fff] ml-5`} onClick={() => addToCartHandler(data)}>Add to cart</div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
