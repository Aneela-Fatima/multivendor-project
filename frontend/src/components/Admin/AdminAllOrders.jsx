import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { getAllOrdersOfAdmin } from "../../redux/actions/order.js";
import Loader from "../Common/Loader.jsx";

const AdminAllOrders = () => {
  const dispatch = useDispatch();
  const { adminOrders, adminOrderLoading, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, [dispatch]);

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
      type: "string",
      minWidth: 130,
      flex: 0.8,
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

  if (adminOrderLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-copper font-body text-lg">Failed to load orders: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h3 className="text-[22px] font-display font-semibold text-ink pb-4">
        All Orders
      </h3>
      <div className="w-full min-h-[45vh] bg-white border border-divider rounded-lg">
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
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

export default AdminAllOrders;