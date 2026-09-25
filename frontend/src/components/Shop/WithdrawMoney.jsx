import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSeller } from "../../redux/actions/user.js";
import styles from "../../styles/styles.js";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineDelete } from "react-icons/ai";
import { axiosServerInstance } from "../../server.js";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader.jsx";

const ShopWithDrawMoney = () => {
  const dispatch = useDispatch();
  const { seller, loading } = useSelector((state) => state.seller);

  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: "",
    bankAccountNumber: "",
    bankHolderName: "",
    bankAddress: "",
  });

  useEffect(() => {
    if (!seller?._id) {
      dispatch(loadSeller());
    }
  }, [dispatch, seller?._id]);

  const availableBalance = seller?.availableBalance || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !bankInfo.bankName ||
      !bankInfo.bankCountry ||
      !bankInfo.bankSwiftCode ||
      !bankInfo.bankAccountNumber ||
      !bankInfo.bankHolderName ||
      !bankInfo.bankAddress
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosServerInstance.put("/shop/update-payment-methods", {
        withdrawMethod: bankInfo,
      });
      toast.success("Withdraw method added successfully!");
      dispatch(loadSeller());
      setPaymentMethod(false);
      setBankInfo({
        bankName: "",
        bankCountry: "",
        bankSwiftCode: "",
        bankAccountNumber: "",
        bankHolderName: "",
        bankAddress: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add withdraw method",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteHandler = async () => {
    if (
      !window.confirm("Are you sure you want to delete your withdraw method?")
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosServerInstance.delete("/shop/delete-withdraw-method", {
        withCredentials: true,
      });
      toast.success("Withdraw method deleted successfully!");
      dispatch(loadSeller());
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete withdraw method",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const withdrawHandler = async () => {
    const amount = Number(withdrawAmount);

    if (amount < 50) {
      toast.error("Minimum withdrawal amount is $50!");
      return;
    }

    if (amount > availableBalance) {
      toast.error(
        `You don't have enough balance! Available: $${availableBalance}`,
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosServerInstance.post("/withdraw/create-withdraw-request", {
        amount,
      });
      toast.success("Withdraw request submitted successfully!");
      setOpen(false);
      setWithdrawAmount(50);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit withdraw request",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[90vh] p-8">
      <div className="w-full bg-white h-full rounded-lg border border-divider flex items-center justify-center flex-col p-8">
        <h5 className="text-[24px] font-display font-semibold text-ink pb-4">
          Available Balance:{" "}
          <span className="text-copper">${availableBalance.toFixed(2)}</span>
        </h5>
        <p className="text-sm font-body text-ink/50 mb-4">
          Minimum withdrawal: $50
        </p>
        <button
          className={`${styles.button} !w-auto !h-[42px] !rounded px-8 whitespace-nowrap ${
            availableBalance < 50 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (availableBalance < 50) {
              toast.error("You don't have enough balance to withdraw!");
              return;
            }
            setOpen(true);
          }}
          disabled={availableBalance < 50}
        >
          Withdraw
        </button>
        <button
          className={`${styles.button} !w-auto !h-[42px] !rounded px-8 mt-3 whitespace-nowrap !bg-slate-200 !text-ink`}
          onClick={() => {
            setOpen(true);
            setPaymentMethod(true);
          }}
        >
          {seller?.withdrawMethod ? "Update Payment Method" : "Add Payment Method"}
        </button>
      </div>

      {open && (
        <div className="w-full h-screen z-[9999] fixed top-0 left-0 flex items-center justify-center bg-ink/40">
          <div
            className={`w-[95%] 800px:w-[50%] bg-white border border-divider rounded-lg ${
              paymentMethod ? "h-[80vh] overflow-y-scroll" : "h-[unset]"
            } min-h-[40vh] p-6 relative`}
          >
            <div className="w-full flex justify-end">
              <RxCross1
                size={25}
                onClick={() => {
                  setOpen(false);
                  setPaymentMethod(false);
                }}
                className="cursor-pointer text-ink/50 hover:text-ink transition-colors"
              />
            </div>

            {paymentMethod ? (
              <div>
                <h3 className="text-[22px] font-display font-semibold text-ink text-center mb-4">
                  Add New Withdraw Method
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-body font-medium text-ink">
                      Bank Name <span className="text-copper">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankName}
                      onChange={(e) =>
                        setBankInfo({ ...bankInfo, bankName: e.target.value })
                      }
                      placeholder="Enter your bank name"
                      className={`${styles.input} mt-1`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium text-ink">
                      Bank Country <span className="text-copper">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankCountry}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankCountry: e.target.value,
                        })
                      }
                      placeholder="Enter your bank country"
                      className={`${styles.input} mt-1`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium text-ink">
                      Bank Swift Code <span className="text-copper">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankSwiftCode}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankSwiftCode: e.target.value,
                        })
                      }
                      placeholder="Enter your bank swift code"
                      className={`${styles.input} mt-1`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium text-ink">
                      Bank Account Number <span className="text-copper">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankAccountNumber}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAccountNumber: e.target.value,
                        })
                      }
                      placeholder="Enter your account number"
                      className={`${styles.input} mt-1`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium text-ink">
                      Bank Holder Name <span className="text-copper">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankHolderName}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankHolderName: e.target.value,
                        })
                      }
                      placeholder="Enter account holder name"
                      className={`${styles.input} mt-1`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium text-ink">
                      Bank Address <span className="text-copper">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankAddress}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAddress: e.target.value,
                        })
                      }
                      placeholder="Enter bank address"
                      className={`${styles.input} mt-1`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${styles.button} w-full ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? "Adding..." : "Add Method"}
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <h3 className="text-[22px] font-display font-semibold text-ink mb-4">
                  Available Withdraw Methods:
                </h3>

                {seller?.withdrawMethod ? (
                  <div>
                    <div className="bg-surface rounded-lg p-4 mb-4 border border-divider">
                      <div className="800px:flex w-full justify-between items-center">
                        <div>
                          <p className="text-sm font-body text-ink/50">
                            Account Number
                          </p>
                          <p className="font-body font-medium text-ink">
                            {"*".repeat(
                              seller.withdrawMethod.bankAccountNumber?.length -
                                4 || 0,
                            )}
                            {seller.withdrawMethod.bankAccountNumber?.slice(
                              -4,
                            ) || "N/A"}
                          </p>
                          <p className="text-sm font-body text-ink/50 mt-2">
                            Bank Name
                          </p>
                          <p className="font-body font-medium text-ink">
                            {seller.withdrawMethod.bankName || "N/A"}
                          </p>
                          <p className="text-sm font-body text-ink/50 mt-2">
                            Holder Name
                          </p>
                          <p className="font-body font-medium text-ink">
                            {seller.withdrawMethod.bankHolderName || "N/A"}
                          </p>
                        </div>
                        <button
                          onClick={deleteHandler}
                          disabled={isSubmitting}
                          className="cursor-pointer mt-4 800px:mt-0 text-copper hover:text-copper/70 transition-colors"
                        >
                          <AiOutlineDelete size={25} />
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-divider pt-4">
                      <h4 className="text-[18px] font-display font-semibold text-ink mb-2">
                        Available Balance:{" "}
                        <span className="text-copper">
                          ${availableBalance.toFixed(2)}
                        </span>
                      </h4>
                      <div className="800px:flex w-full items-center gap-3">
                        <input
                          type="number"
                          placeholder="Amount..."
                          value={withdrawAmount}
                          onChange={(e) =>
                            setWithdrawAmount(Number(e.target.value))
                          }
                          className="800px:w-[150px] w-full border border-divider rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-voltage font-body text-ink"
                          min="50"
                          max={availableBalance}
                        />
                        <button
                          className={`${styles.button} !h-[42px] px-6 ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={withdrawHandler}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Processing..." : "Withdraw"}
                        </button>
                      </div>
                      <p className="text-xs font-body text-ink/40 mt-2">
                        Minimum withdrawal: $50
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[18px] font-body text-ink/60 mb-4">
                      No withdraw methods available!
                    </p>
                    <p className="text-sm font-body text-ink/40 mb-4">
                      Add a bank account to start withdrawing your earnings.
                    </p>
                    <button
                      className={`${styles.button}`}
                      onClick={() => setPaymentMethod(true)}
                    >
                      Add Method
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopWithDrawMoney;
