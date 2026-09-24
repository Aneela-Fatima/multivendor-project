import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/actions/user.js";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import styles from "../../styles/styles.js";
import { RxCross1 } from "react-icons/rx";
import { axiosServerInstance } from "../../server.js";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader.jsx";

const AdminAllUsers = () => {
  const dispatch = useDispatch();
  const { users, usersLoading, error } = useSelector((state) => state.user);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = async () => {
    if (!selectedUserId) return;

    setIsDeleting(true);
    try {
      await axiosServerInstance.delete(`/user/delete-user/${selectedUserId}`);
      toast.success("User deleted successfully!");
      dispatch(getAllUsers());
      setOpenDeleteModal(false);
      setSelectedUserId("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteConfirmation = (id) => {
    setSelectedUserId(id);
    setOpenDeleteModal(true);
  };

  const closeDeleteConfirmation = () => {
    setOpenDeleteModal(false);
    setSelectedUserId("");
  };

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "Email",
      type: "string",
      minWidth: 180,
      flex: 0.9,
    },
    {
      field: "role",
      headerName: "User Role",
      type: "string",
      minWidth: 130,
      flex: 0.6,
      cellClassName: (params) => {
        return params.row.role === "admin"
          ? "text-purple-600 font-semibold"
          : "text-gray-600";
      },
    },
    {
      field: "joinedAt",
      headerName: "Joined At",
      type: "string",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "action",
      flex: 0.8,
      minWidth: 130,
      headerName: "Delete",
      sortable: false,
      renderCell: (params) => {
        return (
          <Button onClick={() => openDeleteConfirmation(params.row.id)}>
            <AiOutlineDelete
              size={20}
              className="text-copper hover:text-copper/70 transition-colors"
            />
          </Button>
        );
      },
    },
  ];

  const rows =
    users?.map((item) => ({
      id: item._id,
      name: item.name || "N/A",
      email: item.email || "N/A",
      role: item.role || "user",
      joinedAt: item.createdAt?.slice(0, 10) || "N/A",
    })) || [];

  if (usersLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-copper font-body text-lg">
          Failed to load users: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h3 className="text-[22px] font-display font-semibold text-ink pb-4">
        All Users
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
            "& .text-purple-600": { color: "#7C3AED", fontWeight: "bold" },
            "& .text-gray-600": { color: "#6B7280" },
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
              Are you sure you want to delete this user?
            </h3>
            <p className="text-center font-body text-ink/50 text-sm mb-4">
              This action cannot be undone.
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

export default AdminAllUsers;
