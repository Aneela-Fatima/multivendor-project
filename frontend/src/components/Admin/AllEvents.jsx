import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { AiOutlineEye } from "react-icons/ai";
import { getAllAdminEvents } from "../../redux/actions/event.js";
import Loader from "../Common/Loader.jsx";

const AdminAllEvents = () => {
  const dispatch = useDispatch();
  const { adminEvents, adminEventsLoading, error } = useSelector(
    (state) => state.events
  );

  useEffect(() => {
    dispatch(getAllAdminEvents());
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "Event ID", minWidth: 180, flex: 0.7 },
    {
      field: "name",
      headerName: "Event Name",
      minWidth: 200,
      flex: 1.2,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 120,
      flex: 0.6,
      renderCell: (params) => {
        return <span className="price-tag text-voltage text-[15px]">${params.row.price}</span>;
      },
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 100,
      flex: 0.5,
      cellClassName: (params) => {
        return params.row.stock < 5 ? "text-copper font-bold" : "text-stock";
      },
    },
    {
      field: "sold",
      headerName: "Sold",
      type: "number",
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "category",
      headerName: "Category",
      type: "string",
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: "preview",
      flex: 0.6,
      minWidth: 100,
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/product/${params.row.id}?isEvent=true`}>
            <Button>
              <AiOutlineEye size={20} className="text-voltage hover:text-voltage/70 transition-colors" />
            </Button>
          </Link>
        );
      },
    },
  ];

  const rows =
    adminEvents?.map((item) => ({
      id: item._id,
      name: item.name || "N/A",
      price: item.discountPrice || item.originalPrice || 0,
      stock: item.stock || 0,
      sold: item.sold_out || 0,
      category: item.category || "Uncategorized",
    })) || [];

  if (adminEventsLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-copper font-body text-lg">Failed to load events: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[22px] font-display font-semibold text-ink">
          All Events
        </h3>
        <span className="text-sm font-body text-ink/50">
          Total: {rows.length} events
        </span>
      </div>
      <div className="w-full min-h-[45vh] bg-white border border-divider rounded-lg">
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            "& .MuiDataGrid-cell": {
              fontFamily: "Inter, sans-serif",
            },
            "& .text-copper": { color: "#F5A623", fontWeight: "bold" },
            "& .text-stock": { color: "#1FAA59" },
          }}
        />
      </div>
    </div>
  );
};

export default AdminAllEvents;