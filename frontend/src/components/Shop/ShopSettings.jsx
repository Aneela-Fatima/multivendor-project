import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, axiosServerInstance } from "../../server.js";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles.js";
import { loadSeller } from "../../redux/actions/seller.js";
import { toast } from "react-toastify";
import Loader from "../Common/Loader.jsx";

const SellerSettings = () => {
  const dispatch = useDispatch();
  const { seller, loading } = useSelector((state) => state.seller);

  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState(seller?.name || "");
  const [description, setDescription] = useState(seller?.description || "");
  const [address, setAddress] = useState(seller?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(seller?.phoneNumber || "");
  const [zipCode, setZipCode] = useState(seller?.zipCode || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatar(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axiosServerInstance.put("/shop/update-shop-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      dispatch(loadSeller());
      toast.success("Shop avatar updated successfully!");
      setAvatar(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update avatar");
    }
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    if (!name || !address || !phoneNumber || !zipCode) {
      toast.error("Please fill all required fields!");
      return;
    }

    setIsUpdating(true);
    try {
      await axiosServerInstance.put(
        "/shop/update-seller-info",
        {
          name,
          address,
          zipCode,
          phoneNumber,
          description,
        },
        { withCredentials: true },
      );
      toast.success("Shop info updated successfully!");
      dispatch(loadSeller());
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update shop info",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  const safeSeller = {
    name: seller?.name || "",
    description: seller?.description || "",
    address: seller?.address || "",
    phoneNumber: seller?.phoneNumber || "",
    zipCode: seller?.zipCode || "",
    avatar: seller?.avatar || { url: "" },
  };

  const inputClass = `${styles.input} !w-full`;
  const labelClass = "block pb-2 font-body font-medium text-ink";

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-8 bg-surface">
      <div className="w-full 800px:w-[80%] flex flex-col justify-center bg-white border border-divider rounded-lg p-8">
        <div className="w-full flex items-center justify-center mb-6">
          <div className="relative">
            <img
              src={
                avatar
                  ? URL.createObjectURL(avatar)
                  : `${backend_url}${safeSeller.avatar?.url}`
              }
              alt="Shop Avatar"
              className="w-[150px] h-[150px] rounded-full object-cover border-4 border-divider"
              onError={(e) => {
                e.target.src =
                  "https://ui-avatars.com/api/?name=" +
                  safeSeller.name +
                  "&background=2F5FF6&color=fff&size=150";
              }}
            />
            <div className="w-[35px] h-[35px] bg-surface rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px] border border-divider hover:bg-divider transition-colors">
              <input
                type="file"
                id="shop-avatar"
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={handleImage}
              />
              <label htmlFor="shop-avatar" className="cursor-pointer">
                <AiOutlineCamera size={18} className="text-ink/60" />
              </label>
            </div>
          </div>
        </div>

        <form className="flex flex-col items-center" onSubmit={updateHandler}>
          <div className="w-full 800px:w-[50%] mt-4">
            <label className={labelClass}>
              Shop Name <span className="text-copper">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter shop name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="w-full 800px:w-[50%] mt-4">
            <label className={labelClass}>Shop Description</label>
            <textarea
              placeholder="Describe your shop..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} min-h-[100px] resize-y`}
              rows={4}
            />
          </div>

          <div className="w-full 800px:w-[50%] mt-4">
            <label className={labelClass}>
              Shop Address <span className="text-copper">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter shop address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="w-full 800px:w-[50%] mt-4">
            <label className={labelClass}>
              Phone Number <span className="text-copper">*</span>
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="w-full 800px:w-[50%] mt-4">
            <label className={labelClass}>
              Zip Code <span className="text-copper">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter zip code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="w-full 800px:w-[50%] mt-6">
            <button
              type="submit"
              disabled={isUpdating}
              className={`${styles.button} !w-full !h-[45px] ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isUpdating ? "Updating..." : "Update Shop"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerSettings;