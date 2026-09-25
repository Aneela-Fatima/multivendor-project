import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { VscNewFile } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

const navItems = [
  { id: 1, to: "/dashboard", icon: RxDashboard, label: "Dashboard" },
  { id: 2, to: "/dashboard-orders", icon: FiShoppingBag, label: "All Orders" },
  { id: 3, to: "/dashboard-products", icon: FiPackage, label: "All Products" },
  { id: 4, to: "/dashboard-create-product", icon: AiOutlineFolderAdd, label: "Create Products" },
  { id: 5, to: "/dashboard-events", icon: MdOutlineLocalOffer, label: "All Events" },
  { id: 6, to: "/dashboard-create-event", icon: VscNewFile, label: "Create Event" },
  { id: 7, to: "/dashboard-withdraw-money", icon: CiMoneyBill, label: "Withdraw Money" },
  { id: 8, to: "/dashboard-messages", icon: BiMessageSquareDetail, label: "Shop Inbox" },
  { id: 9, to: "/dashboard-coupouns", icon: AiOutlineGift, label: "Discount Codes" },
  { id: 10, to: "/dashboard-refunds", icon: HiOutlineReceiptRefund, label: "Refunds" },
  { id: 11, to: "/settings", icon: CiSettings, label: "Settings" },
];

const NavRow = ({ to, icon: Icon, label, isActive }) => (
  <Link to={to} className="block px-3">
    <div
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-colors duration-150 ${
        isActive
          ? "bg-[#f63b60]/10 text-[#f63b60]"
          : "text-[#555] hover:bg-gray-50"
      }`}
    >
      <Icon size={22} />
      <h5 className="hidden 800px:block text-[15px] font-medium truncate">
        {label}
      </h5>
    </div>
  </Link>
);

const DashboardSideBar = ({ active }) => {
  return (
    <div className="w-full h-[89vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10 py-3">
      {navItems.map((item) => (
        <NavRow key={item.id} {...item} isActive={active === item.id} />
      ))}
    </div>
  );
};

export default DashboardSideBar;
