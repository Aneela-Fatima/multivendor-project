import React, { useEffect } from "react";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order.js";
import { getAllSellers } from "../../redux/actions/sellers.js";
import Loader from "../Layout/Loader";

const AdminDashboardMain = () => {
  const dispatch = useDispatch();
  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order,
  );

  const { sellers, sellersLoading } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, [dispatch]);

  const adminEarning =
    adminOrders
      ?.filter((item) => item.status === "Delivered")
      ?.reduce((acc, item) => acc + Number(item?.totalPrice || 0) * 0.1, 0) ||
    0;

  const adminBalance = adminEarning.toFixed(2);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      minWidth: 130,
      flex: 0.8,
      type: "string",
    },
  ];

  const rows =
    adminOrders?.map((item) => ({
      id: item._id,
      itemsQty: item?.cart?.reduce((acc, it) => acc + (it.qty || 0), 0) || 0,
      total: `${item?.totalPrice || 0} $`,
      status: item?.status || "Processing",
      createdAt: item?.createdAt?.slice(0, 10) || "N/A",
    })) || [];

  if (adminOrderLoading || sellersLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader />
      </div>
    );
  }

  const statCard = (icon, label, value, linkTo, linkLabel) => (
    <div className="w-full mb-4 800px:w-[30%] min-h-[18vh] bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 px-5 py-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-[#f63b60]/10 flex items-center justify-center text-[#f63b60] shrink-0">
          {icon}
        </div>
        <h3 className="text-[14px] font-medium text-gray-500">
          {label}
        </h3>
      </div>
      <h5 className="pt-3 pl-1 text-[24px] font-bold text-gray-900">
        {value}
      </h5>
      <Link to={linkTo}>
        <h5 className="pt-3 pl-1 text-[#f63b60] hover:underline cursor-pointer text-sm font-medium">
          {linkLabel}
        </h5>
      </Link>
    </div>
  );

  return (
    <div className="w-full p-6">
      <h3 className="text-[22px] font-semibold text-gray-900 pb-4">
        Overview
      </h3>

      <div className="w-full block 800px:flex items-center justify-between gap-4">
        {statCard(
          <AiOutlineMoneyCollect size={22} />,
          "Total Earning",
          `$ ${adminBalance}`,
          "/admin-orders",
          "View Orders",
        )}
        {statCard(
          <MdBorderClear size={22} />,
          "All Sellers",
          sellers?.length || 0,
          "/admin-sellers",
          "View Sellers",
        )}
        {statCard(
          <AiOutlineMoneyCollect size={22} />,
          "All Orders",
          adminOrders?.length || 0,
          "/admin-orders",
          "View Orders",
        )}
      </div>

      <br />

      <h3 className="text-[22px] font-semibold text-gray-900 pb-2">
        Latest Orders
      </h3>
      <div className="w-full min-h-[45vh] bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            "& .MuiDataGrid-cell": {
              fontFamily: "Inter, sans-serif",
            },
            "& .greenColor": { color: "#1FAA59", fontWeight: "bold" },
            "& .redColor": { color: "#131A2B", fontWeight: "bold" },
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboardMain;
