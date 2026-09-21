import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { axiosServerInstance } from "../../server.js";
import PaymentInfo from "./PaymentInfo.jsx";
import PaymentCartData from "./PaymentCartData.jsx";
import { clearCart } from "../../redux/actions/cart.js";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("latestOrder");
    if (stored) {
      setOrderData(JSON.parse(stored));
    }
  }, []);

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    if (!orderData || !orderData.cart || orderData.cart.length === 0) {
      toast.error("No order data found. Please go through checkout again.");
      navigate("/checkout");
      return;
    }

    const order = {
      cart: orderData?.cart || [],
      shippingAddress: orderData?.shippingAddress || {},
      user: user || {},
      totalPrice: orderData?.totalPrice || 0,
      paymentInfo: {
        type: "Cash On Delivery",
      },
    };

    try {
      await axiosServerInstance.post(`/order/create-order`, order);

      dispatch(clearCart());

      localStorage.setItem("latestOrder", JSON.stringify([]));

      navigate("/order/success");
      toast.success("Order placed successfully! (COD)");
    } catch (error) {
      toast.error(error.response?.data?.message || "COD order failed");
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8 bg-surface min-h-screen">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex gap-8">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo cashOnDeliveryHandler={cashOnDeliveryHandler} />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <PaymentCartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

export default Payment;