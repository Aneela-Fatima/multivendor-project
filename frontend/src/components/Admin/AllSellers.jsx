import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import styles from "../../styles/styles.js";
import { axiosServerInstance } from "../../server.js";
import { getAllSellers } from "../../redux/actions/seller.js";
import Loader from "../Common/Loader.jsx";

const AdminAllSellers = () => {
  const dispatch = useDispatch();
  const { sellers, sellersLoading, sellersError } = useSelector(
    (state) => state.seller,
  );
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const handleDelete = async () => {
    if (!selectedSellerId) return;

    setIsDeleting(true);
    try {
      await axiosServerInstance.delete(
        `/shop/delete-seller/${selectedSellerId}`,
      );
      toast.success("Seller deleted successfully!");
      dispatch(getAllSellers());
      setOpenDeleteModal(false);
      setSelectedSellerId("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete seller");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteConfirmation = (id) => {
    setSelectedSellerId(id);
    setOpenDeleteModal(true);
  };

  const closeDeleteConfirmation = () => {
    setOpenDeleteModal(false);
    setSelectedSellerId("");
  };

  const columns = [
    { field: "id", headerName: "Seller ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Shop Name",
      minWidth: 180,
      flex: 0.9,
    },
    {
      field: "email",
      headerName: "Email",
      type: "string",
      minWidth: 180,
      flex: 0.9,
    },
    {
      field: "address",
      headerName: "Address",
      type: "string",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "joinedAt",
      headerName: "Joined At",
      type: "string",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "preview",
      flex: 0.6,
      minWidth: 120,
      headerName: "Preview Shop",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/shop/preview/${params.row.id}`}>
            <Button>
              <AiOutlineEye size={20} className="text-voltage hover:text-voltage/70 transition-colors" />
            </Button>
          </Link>
        );
      },
    },
    {
      field: "delete",
      flex: 0.6,
      minWidth: 120,
      headerName: "Delete",
      sortable: false,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => openDeleteConfirmation(params.row.id)}
          >
            <AiOutlineDelete size={20} className="text-copper hover:text-copper/70 transition-colors" />
          </Button>
        );
      },
    },
  ];

  const rows =
    sellers?.map((item) => ({
      id: item._id,
      name: item.name || "N/A",
      email: item.email || "N/A",
      address: item.address || "N/A",
      joinedAt: item.createdAt?.slice(0, 10) || "N/A",
    })) || [];

  if (sellersLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (sellersError) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-copper font-body text-lg">Failed to load sellers: {sellersError}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h3 className="text-[22px] font-display font-semibold text-ink pb-4">
        All Sellers
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
          }}
        />
      </div>

      {openDeleteModal && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-ink/40 flex items-center justify-center h-screen">
          <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white border border-divider rounded-lg p-6">
            <div className="w-full flex justify-end cursor-pointer">
              <RxCross1
                size={25}
                onClick={closeDeleteConfirmation}
                className="text-ink/50 hover:text-ink transition-colors"
              />
            </div>
            <h3 className="text-[22px] text-center py-4 font-display font-semibold text-ink">
              Are you sure you want to delete this seller?
            </h3>
            <p className="text-center font-body text-ink/50 text-sm mb-4">
              This will also remove all products associated with this shop.
            </p>
            <div className="w-full flex items-center justify-center gap-4">
              <button
                className={`${styles.button} !bg-surface !text-ink border border-divider hover:!bg-divider transition-colors !h-[42px] px-6`}
                onClick={closeDeleteConfirmation}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className={`${styles.button} !h-[42px] px-6 ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllSellers;