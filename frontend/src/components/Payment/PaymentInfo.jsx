import React, { useState } from "react";
import styles from "../../styles/styles.js";

const PaymentInfo = ({ cashOnDeliveryHandler }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    setIsProcessing(true);
    try {
      await cashOnDeliveryHandler(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full bg-white border border-divider rounded-xl p-5 800px:p-8 shadow-[0_12px_35px_rgba(31,41,55,0.06)]">
      <div>
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-divider">
          <div className="flex items-center">
            <div className="w-[25px] h-[25px] rounded-full bg-copper border-[3px] border-copper relative flex items-center justify-center">
            <div className="w-[13px] h-[13px] bg-white rounded-full" />
            </div>
            <div className="pl-3">
              <h4 className="text-[18px] font-display font-semibold text-ink/90">
                Cash on Delivery
              </h4>
              <p className="text-xs text-ink/50 mt-1">Pay safely when your order arrives</p>
            </div>
          </div>
          <span className="rounded-full bg-[#eef8f0] px-3 py-1 text-xs font-semibold text-[#3d8b50]">
            Available
          </span>
        </div>

        <div className="w-full flex pt-6">
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="rounded-lg bg-[#faf8f5] border border-[#eee6dc] p-4 mb-6">
              <p className="text-ink/70 font-body text-sm leading-6">
                Your order will be prepared immediately. Please keep the exact amount ready for the delivery partner.
              </p>
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className={`${styles.button} w-full !h-[50px] !rounded-md text-[16px] font-semibold tracking-wide text-white ${
                isProcessing ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? "Placing Order..." : "Confirm Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;