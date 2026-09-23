import React from "react";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar.jsx";
import AdminAllWithdraws from "../components/Admin/AdminAllWithdraws.jsx";

const AdminAllWithdrawsPage = () => {
  return (
    <div>
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={7} />
          </div>
          <AdminAllWithdraws />
        </div>
      </div>
    </div>
  );
};

export default AdminAllWithdrawsPage;
