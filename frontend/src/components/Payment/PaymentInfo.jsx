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
    <div className="w-full 800px:w-[95%] bg-white border border-divider rounded-lg p-5 pb-8">
      <div>
        <div className="flex w-full pb-5 border-b border-divider mb-2">
          <div className="w-[25px] h-[25px] rounded-full bg-copper border-[3px] border-copper relative flex items-center justify-center">
            <div className="w-[13px] h-[13px] bg-white rounded-full" />
          </div>
          <h4 className="text-[18px] pl-2 font-display font-semibold text-ink/90">
            Cash on Delivery
          </h4>
        </div>

        <div className="w-full flex pb-4">
          <form className="w-full" onSubmit={handleSubmit}>
            <p className="text-ink/50 font-body text-sm mb-4">
              Pay when you receive your order. No online payment required.
            </p>
            <button
              type="submit"
              disabled={isProcessing}
              className={`${styles.button} w-full !h-[45px] !rounded-md text-[18px] font-semibold ${
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