import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill } from "react-icons/ci";
import { Link } from "react-router-dom";
import { GrWorkshop } from "react-icons/gr";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { BsHandbag } from "react-icons/bs";
import { AiOutlineSetting } from "react-icons/ai";

const navItems = [
  { id: 1, to: "/admin/dashboard", icon: RxDashboard, label: "Dashboard" },
  { id: 2, to: "/admin-orders", icon: FiShoppingBag, label: "All Orders" },
  { id: 3, to: "/admin-sellers", icon: GrWorkshop, label: "All Sellers" },
  { id: 4, to: "/admin-users", icon: HiOutlineUserGroup, label: "All Users" },
  { id: 5, to: "/admin-products", icon: BsHandbag, label: "All Products" },
  { id: 6, to: "/admin-events", icon: MdOutlineLocalOffer, label: "All Events" },
  { id: 7, to: "/admin-withdraw-request", icon: CiMoneyBill, label: "Withdraw Request" },
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

const AdminSideBar = ({ active }) => {
  return (
    <>
      <div className="w-full h-[89vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10 py-3">
        {navItems.map((item) => (
          <NavRow key={item.id} {...item} isActive={active === item.id} />
        ))}
      </div>

      <div className="px-3 mt-2">
        <NavRow
          to="/profile"
          icon={AiOutlineSetting}
          label="Settings"
          isActive={active === 8}
        />
      </div>
    </>
  );
};

export default AdminSideBar;
