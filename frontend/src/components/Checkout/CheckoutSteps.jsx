import React from "react";

const CheckoutSteps = ({ active }) => {
  const steps = ["Shipping", "Payment"];

  return (
    <div className="w-full flex justify-center">
      <div className="w-[90%] 800px:w-[70%] flex items-center">
        {steps.map((step, index) => {
          const isActive = index + 1 === active;
          const isCompleted = index + 1 < active;

          return (
            <div key={step} className="flex w-full items-center">
              <div
                className={`flex items-center justify-center rounded-full border text-sm font-semibold ${
                  isActive || isCompleted
                    ? "border-[#f63b60] bg-[#f63b60] text-white"
                    : "border-gray-300 bg-white text-gray-500"
                } h-[35px] w-[35px]`}
              >
                {index + 1}
              </div>
              <div
                className={`h-[3px] flex-1 ${
                  isCompleted ? "bg-[#f63b60]" : "bg-gray-200"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
