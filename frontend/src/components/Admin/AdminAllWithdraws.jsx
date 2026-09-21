import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import styles from "../../styles/styles.js";
import { axiosServerInstance } from "../../server.js";
import Loader from "../Common/Loader.jsx";

const AdminAllWithdraws = () => {
  const [withdraws, setWithdraws] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedWithdraw, setSelectedWithdraw] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchWithdraws();
  }, []);

  const fetchWithdraws = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosServerInstance.get(
        "/withdraw/get-all-withdraw-request",
        { withCredentials: true },
      );
      setWithdraws(data.withdraws || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load withdraws");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedWithdraw) return;

    setIsUpdating(true);
    try {
      const { data } = await axiosServerInstance.put(
        `/withdraw/update-withdraw-request/${selectedWithdraw.id}`,
        { sellerId: selectedWithdraw.sellerId },
        { withCredentials: true },
      );
      toast.success(data.message || "Withdraw updated successfully!");
      setWithdraws(data.withdraws || []);
      setOpenModal(false);
      setSelectedWithdraw(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update withdraw");
    } finally {
      setIsUpdating(false);
    }
  };

  const columns = [
    { field: "id", headerName: "Withdraw ID", minWidth: 180, flex: 0.7 },
    {
      field: "shopName",
      headerName: "Shop Name",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "shopId",
      headerName: "Shop ID",
      minWidth: 180,
      flex: 0.8,
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 120,
      flex: 0.6,
      renderCell: (params) => (
        <span className="price-tag text-stock text-[15px] font-semibold">
          ${params.row.amount}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.6,
      cellClassName: (params) => {
        return params.row.status === "succeed"
          ? "text-stock font-bold"
          : "text-copper font-bold";
      },
    },
    {
      field: "createdAt",
      headerName: "Requested At",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "action",
      headerName: "Update",
      minWidth: 120,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => {
        if (params.row.status === "succeed") {
          return <span className="text-ink/40 font-body text-sm">Completed</span>;
        }
        return (
          <Button
            onClick={() => {
              setSelectedWithdraw(params.row);
              setOpenModal(true);
            }}
          >
            <BsPencil size={18} className="text-voltage hover:text-voltage/70 transition-colors" />
          </Button>
        );
      },
    },
  ];

  const rows =
    withdraws?.map((item) => ({
      id: item._id,
      shopId: item.seller?._id || "N/A",
      shopName: item.seller?.name || "N/A",
      amount: item.amount || 0,
      status: item.status || "Processing",
      createdAt: item.createdAt?.slice(0, 10) || "N/A",
      sellerId: item.seller?._id,
    })) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[22px] font-display font-semibold text-ink">
          Withdraw Requests
        </h3>
        <span className="text-sm font-body text-ink/50">
          Total: {rows.length} requests
        </span>
      </div>
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
            "& .text-stock": { color: "#1FAA59", fontWeight: "bold" },
            "& .text-copper": { color: "#F5A623", fontWeight: "bold" },
          }}
        />
      </div>

      {openModal && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-ink/40 flex items-center justify-center h-screen">
          <div className="w-[95%] 800px:w-[40%] min-h-[25vh] bg-white border border-divider rounded-lg p-6">
            <div className="w-full flex justify-end cursor-pointer">
              <RxCross1
                size={25}
                onClick={() => {
                  setOpenModal(false);
                  setSelectedWithdraw(null);
                }}
                className="text-ink/50 hover:text-ink transition-colors"
              />
            </div>

            <h1 className="text-[22px] text-center font-display font-semibold text-ink">
              Update Withdraw Status
            </h1>
            <p className="text-center font-body text-ink/50 text-sm mb-4">
              Confirm to mark this withdraw request as <strong className="text-stock">Succeed</strong>
            </p>

            <div className="flex flex-col items-center gap-4 mt-4">
              <div className="w-full bg-surface p-4 rounded-lg border border-divider">
                <p className="text-sm font-body text-ink/70">
                  <span className="font-semibold text-ink">Shop:</span>{" "}
                  {selectedWithdraw?.shopName}
                </p>
                <p className="text-sm font-body text-ink/70">
                  <span className="font-semibold text-ink">Amount:</span>{" "}
                  <span className="price-tag text-stock">${selectedWithdraw?.amount}</span>
                </p>
                <p className="text-sm font-body text-ink/70">
                  <span className="font-semibold text-ink">Current Status:</span>{" "}
                  <span className="text-copper font-medium">{selectedWithdraw?.status}</span>
                </p>
              </div>

              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating}
                className={`${styles.button} !h-[42px] px-8 text-[16px] ${
                  isUpdating ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isUpdating ? "Processing..." : "Confirm & Mark as Succeed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllWithdraws;