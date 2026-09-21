import React from "react";

const PaymentCartData = ({ orderData }) => {
  const subtotal = Number(orderData?.subTotalPrice) || 0;
  const shipping = Number(orderData?.shipping) || 0;
  const discount = Number(orderData?.discountPrice) || 0;
  const total = Number(orderData?.totalPrice) || 0;

  return (
    <div className="w-full bg-white border border-divider rounded-lg p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-body text-ink/60">Subtotal:</h3>
        <h5 className="text-[18px] font-body font-semibold text-ink">${subtotal.toFixed(2)}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-body text-ink/60">Shipping:</h3>
        <h5 className="text-[18px] font-body font-semibold text-ink">${shipping.toFixed(2)}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b border-divider pb-3">
        <h3 className="text-[16px] font-body text-ink/60">Discount:</h3>
        <h5 className="text-[18px] font-body font-semibold text-stock">
          {discount > 0 ? `- $${discount.toFixed(2)}` : "$0.00"}
        </h5>
      </div>
      <h5 className="text-[18px] font-display font-bold text-end pt-3 text-copper">
        Total: ${total.toFixed(2)}
      </h5>
      <br />
    </div>
  );
};

export default PaymentCartData;