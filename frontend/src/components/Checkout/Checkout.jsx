import React, { useState, useEffect } from "react";
import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = () => {
    if (
      address1 === "" ||
      address2 === "" ||
      zipCode === null ||
      country === "" ||
      city === ""
    ) {
      toast.error("Please fill all required fields!");
    } else {
      const shippingAddress = {
        address1,
        address2,
        zipCode,
        country,
        city,
      };

      const orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        shipping,
        discountPrice,
        shippingAddress,
        user,
      };

      // update local storage with updated orders array
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice = cart.reduce((acc, item) => {
    const price = Number(item?.discountPrice ?? item?.price ?? 0);
    return acc + Number(item?.qty || 0) * price;
  }, 0);

  const shipping = subTotalPrice * 0.1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    if (!name) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const res = await axios.get(`${server}/coupon/get-coupon-value/${name}`);
      const shopId = res.data.couponCode?.shopId;
      const couponCodeValue = res.data.couponCode?.value;

      if (res.data.couponCode !== null) {
        const isCouponValid =
          cart && cart.filter((item) => item.shopId === shopId);

        if (isCouponValid.length === 0) {
          toast.error("Coupon code is not valid for this shop");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce((acc, item) => {
            const price = Number(item?.discountPrice ?? item?.price ?? 0);
            return acc + Number(item?.qty || 0) * price;
          }, 0);
          const discountPrice = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountPrice);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
        }
      }
      if (res.data.couponCode === null) {
        toast.error("Coupon code doesn't exist!");
        setCouponCode("");
        setCouponCodeData(null);
        return;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Coupon validation failed");
    }
  };

  const discountPercentage = couponCodeData ? discountPrice : "";
  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentage).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentage={discountPercentage}
          />
        </div>
      </div>
      <div
        className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}
        onClick={paymentSubmit}
      >
        <h5 className="text-white">Go to Payment</h5>
      </div>
    </div>
  );
};
const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
  selectedAddressId,
  setSelectedAddressId,
}) => {
  const handleSavedAddressSelect = (item) => {
    setSelectedAddressId(item._id || item.addressType);
    setAddress1(item.address1 || "");
    setAddress2(item.address2 || "");
    setZipCode(item.zipCode || "");
    setCountry(item.country || "");
    setCity(item.city || "");
  };

  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5 pb-8">
      <h5 className="text-[18px] font-[600] text-[#1f2937]">
        Shipping Address
      </h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-medium text-[#374151]">
              Full Name
            </label>
            <input
              type="text"
              required
              value={user ? user.name : ""}
              className={`${styles.input} !w-[95%] !bg-[#f9fafb]`}
              readOnly
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-medium text-[#374151]">
              Email Address
            </label>
            <input
              type="email"
              required
              value={user ? user.email : ""}
              className={`${styles.input} !bg-[#f9fafb]`}
              readOnly
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-medium text-[#374151]">
              Phone Number
            </label>
            <input
              type="number"
              required
              value={user ? user.phoneNumber || "" : ""}
              className={`${styles.input} !w-[95%] !bg-[#f9fafb]`}
              readOnly
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-medium text-[#374151]">
              Zip Code
            </label>
            <input
              type="number"
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className={`${styles.input} !bg-[#fff]`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-medium text-[#374151]">
              Country
            </label>
            <select
              className="w-[95%] border border-[#d1d5db] h-[40px] rounded-[5px] bg-white px-2"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option className="block pb-2" value="">
                Choose your country
              </option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-medium text-[#374151]">
              City
            </label>
            <select
              className="w-[95%] border border-[#d1d5db] h-[40px] rounded-[5px] bg-white px-2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option className="block pb-2" value="">
                Choose your City
              </option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-medium text-[#374151]">
              Address 1
            </label>
            <input
              type="text"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-medium text-[#374151]">
              Address 2
            </label>
            <input
              type="text"
              required
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className={`${styles.input}`}
            />
          </div>
        </div>
      </form>

      <div className="mt-3 border-t border-[#e5e7eb] pt-4">
        <button
          type="button"
          className="text-[16px] font-medium text-[#374151] cursor-pointer hover:text-[#111827] transition"
          onClick={() => setUserInfo(!userInfo)}
        >
          Choose from saved address
        </button>

        {userInfo && user && user.addresses && user.addresses.length > 0 && (
          <div className="mt-4 space-y-3">
            {user.addresses.map((item, index) => {
              const isChecked =
                selectedAddressId === (item._id || item.addressType);

              return (
                <label
                  key={item._id || `${item.addressType}-${index}`}
                  className={`flex items-center gap-3 w-full rounded-lg border p-3 cursor-pointer transition ${
                    isChecked
                      ? "border-[#f63b60] bg-[#fff2f5]"
                      : "border-[#e5e7eb] bg-[#f9fafb]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleSavedAddressSelect(item)}
                    className="h-4 w-4 accent-[#f63b60]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-[#111827]">
                        {item.addressType || "Saved Address"}
                      </span>
                      <span className="text-xs text-[#6b7280]">
                        {item.city || ""}
                      </span>
                    </div>
                    <p className="text-sm text-[#4b5563] mt-1">
                      {item.address1}
                      {item.address2 ? `, ${item.address2}` : ""}
                    </p>
                    <p className="text-xs text-[#6b7280]">
                      {item.country || ""} · {item.zipCode || ""}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        {userInfo &&
          (!user || !user.addresses || user.addresses.length === 0) && (
            <div className="mt-4 rounded-lg border border-dashed border-[#d1d5db] p-3 text-sm text-[#6b7280]">
              No saved address found.
            </div>
          )}
      </div>
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentage,
}) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">${subTotalPrice}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
        <h5 className="text-[18px] font-[600]">${shipping}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
          - {discountPercentage ? "$" + discountPercentage.toString() : null}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">${totalPrice}</h5>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={`${styles.input} h-[40px] pl-2`}
          placeholder="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />
        <button
          type="submit"
          className="mt-8 h-[40px] w-full cursor-pointer rounded-[3px] border border-[#f63b60] bg-white text-center text-[#f63b60]"
        >
          Apply code
        </button>
      </form>
    </div>
  );
};

export default Checkout;
