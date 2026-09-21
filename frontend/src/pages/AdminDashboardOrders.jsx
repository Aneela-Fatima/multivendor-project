import React from 'react'
import AdminSideBar from '../../components/Admin/AdminSideBar.jsx';
import AdminAllOrders from '../../components/Admin/AdminAllOrders.jsx';

const AdminAllOrderspage = () => {
  return (
    <div>
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={2} />
          </div>
          <AdminAllOrders />
        </div>
      </div>
    </div>
  );
}

export default AdminAllOrderspage