import React, { useState } from "react";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import { backend_url } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const normalizePrice = (item) => {
  const price = Number(
    item?.discountPrice ?? item?.discounPrice ?? item?.price ?? 0,
  );
  return Number.isFinite(price) ? price : 0;
};

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = cart.reduce((acc, item) => {
    const itemQty = Number(item?.qty || 1);
    return acc + itemQty * normalizePrice(item);
  }, 0);

  const quantityChangeHandler = (data) => {
    const safeQty = Number(data?.qty || 1);
    const safePrice = normalizePrice(data);

    dispatch(
      addToCart({
        ...data,
        qty: safeQty,
        discountPrice: safePrice,
        discounPrice: safePrice,
      }),
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0000004b] backdrop-blur-[1px]">
      <div className="fixed top-0 right-0 flex h-screen w-full max-w-[430px] flex-col justify-between bg-white shadow-2xl">
        {cart && cart.length === 0 ? (
          <div className="flex h-screen w-full items-center justify-center bg-slate-50">
            <div className="absolute right-5 top-5">
              <RxCross1
                size={25}
                className="cursor-pointer text-slate-700 hover:text-slate-900"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5 className="text-lg font-semibold text-slate-700">
              Cart is Empty!
            </h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer text-slate-700 hover:text-slate-900"
                  onClick={() => setOpenCart(false)}
                />
              </div>

              <div className={`${styles.noramlFlex} p-4 text-slate-800`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[600]">
                  {cart && cart.length} items
                </h5>
              </div>

              <div className="w-full border-t border-slate-200">
                {cart &&
                  cart.map((i, index) => (
                    <CartSingle
                      key={i?._id || index}
                      data={i}
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                    />
                  ))}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white p-4">
              <Link to="/checkout">
                <div className="flex h-[48px] w-full items-center justify-center rounded-[8px] bg-[#e44343] transition hover:bg-[#d63232]">
                  <h1 className="text-[18px] font-[600] text-white">
                    Checkout Now (USD${totalPrice.toFixed(2)})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const safePrice = normalizePrice(data);
  const [value, setValue] = useState(Number(data?.qty || 1));
  const totalPrice = safePrice * value;

  const updateQty = (nextQty) => {
    const safeQty = Math.max(1, Number(nextQty) || 1);
    setValue(safeQty);

    quantityChangeHandler({
      ...data,
      qty: safeQty,
      discountPrice: safePrice,
      discounPrice: safePrice,
    });
  };

  const increment = () => {
    if (Number(data.stock) > 0 && value >= Number(data.stock)) {
      toast.error("Product stock limited");
      return;
    }
    updateQty(value + 1);
  };

  const decrement = () => {
    if (value <= 1) {
      updateQty(1);
      return;
    }
    updateQty(value - 1);
  };

  return (
    <div className="border-b border-slate-200 p-4 transition hover:bg-slate-50">
      <div className="flex w-full items-center gap-3">
        <div className="flex flex-col items-center justify-center gap-2">
          <button
            type="button"
            className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#e44343] text-white shadow-sm transition hover:scale-105"
            onClick={increment}
          >
            <HiPlus size={16} />
          </button>
          <span className="min-w-[22px] text-center text-sm font-semibold text-slate-700">
            {value}
          </span>
          <button
            type="button"
            className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#e5e7eb] text-slate-600 transition hover:bg-[#dfe3e8]"
            onClick={decrement}
          >
            <HiOutlineMinus size={15} />
          </button>
        </div>

        <img
          src={`${backend_url}${data?.images?.[0]}`}
          alt={data?.name || "product image"}
          className="h-[96px] w-[96px] rounded-[8px] border border-slate-200 object-cover"
        />

        <div className="min-w-0 flex-1">
          <h1 className="text-base font-semibold text-slate-800">
            {data.name}
          </h1>
          <h4 className="mt-1 text-sm text-slate-500">
            US${safePrice.toFixed(2)} × {value}
          </h4>
          <h4 className="mt-1 text-lg font-bold text-[#d02222]">
            US${totalPrice.toFixed(2)}
          </h4>
        </div>

        <RxCross1
          className="ml-2 cursor-pointer text-slate-500 transition hover:text-slate-800"
          onClick={() => removeFromCartHandler(data)}
        />
      </div>
    </div>
  );
};

export default Cart;
