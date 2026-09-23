import React from "react";

const PaymentCartData = ({ orderData }) => {
  const subtotal = Number(orderData?.subTotalPrice) || 0;
  const shipping = Number(orderData?.shipping) || 0;
  const discount = Number(orderData?.discountPrice) || 0;
  const total = Number(orderData?.totalPrice) || 0;

  return (
    <div className="w-full bg-white border border-divider rounded-xl p-5 800px:p-6 shadow-[0_12px_35px_rgba(31,41,55,0.06)]">
      <div className="flex items-center justify-between border-b border-divider pb-4 mb-5">
        <h3 className="text-[18px] font-display font-semibold text-ink">Order summary</h3>
        <span className="text-xs text-ink/45">Review</span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[14px] font-body text-ink/60">Subtotal</h3>
        <h5 className="text-[15px] font-body font-semibold text-ink">${subtotal.toFixed(2)}</h5>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[14px] font-body text-ink/60">Shipping</h3>
        <h5 className="text-[15px] font-body font-semibold text-ink">${shipping.toFixed(2)}</h5>
      </div>
      <div className="flex justify-between items-center border-b border-divider pb-5">
        <h3 className="text-[14px] font-body text-ink/60">Discount</h3>
        <h5 className="text-[15px] font-body font-semibold text-stock">
          {discount > 0 ? `- $${discount.toFixed(2)}` : "$0.00"}
        </h5>
      </div>
      <div className="flex justify-between items-end pt-5">
        <span className="text-[14px] font-semibold text-ink/60">Total to pay</span>
        <h5 className="text-[24px] font-display font-bold text-copper">${total.toFixed(2)}</h5>
      </div>
    </div>
  );
};

export default PaymentCartData;