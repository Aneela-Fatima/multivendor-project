import React, { useState } from "react";
import { backend_url } from "../../server";
import { useSelector } from "react-redux";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import { MdOutlineTrackChanges } from "react-icons/md";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const ProfileContent = ({ active }) => {
  const user = useSelector((state) => state.user);
  const [name, setName] = React.useState(user && user.name);
  const [email, setEmail] = React.useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full bg-white rounded-[10px] p-5">
      {/* profile Page */}
      {active === 1 && (
        <>
          <div className="w-full flex justify-center">
            <div className="relative">
              <img
                alt=""
                src={`${backend_url}${user?.avatar}`}
                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
              />
              <div className="absolute bottom-[5px] right-[5px] bg-[#E3E9EE] w-[30px] h-[30px] rounded-full flex items-center justify-center cursor-pointer">
                <AiOutlineCamera size={20} color="#fff" />
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full px-5">
            <form onSubmit={handleSubmit} aria-required={true}>
              <div className="w-full 800px:flex block pb-3">
                <div className="800px:w-[50%] w-[100%]">
                  <label className="block pb-2">First Name</label>
                  <input
                    type="text"
                    className={`{${styles.input} w-[95%] mb-4 800px:mb-0`}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="800px:w-[50%] w-[100%]">
                  <label className="block pb-2">Email Address</label>
                  <input
                    type="text"
                    className={`{${styles.input} w-[95%] mb-2 800px:mb-0`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full 800px:flex block pb-3">
                <div className="800px:w-[50%] w-[100%]">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="number"
                    className={`{${styles.input} w-[95%] mb-4 800px:mb-0`}
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="800px:w-[50%] w-[100%]">
                  <label className="block pb-2">Zip Code</label>
                  <input
                    type="number"
                    className={`{${styles.input} w-[95%] mb-4 800px:mb-0`}
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full 800px:flex block pb-3">
                <div className="800px:w-[50%] w-[100%]">
                  <label className="block pb-2">Address 1</label>
                  <input
                    type="address"
                    className={`{${styles.input} w-[95%] mb-4 800px:mb-0`}
                    required
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                  />
                </div>

                <div className="800px:w-[50%] w-[100%]">
                  <label className="block pb-2">Address 2</label>
                  <input
                    type="address"
                    className={`{${styles.input} w-[95%] mb-4 800px:mb-0`}
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                  />
                </div>
              </div>

              <input
                className={`w-[250px] h-[40px] border border-[#3a3a3a] text-center rounded-[3px] mt-8 cursor-pointer`}
                type="submit"
                value="Update"
                required
              />
            </form>
          </div>
        </>
      )}

      {/* Orders Page */}
      {active === 2 && (
        <div className="w-full min-h-[40vh] flex items-center justify-center">
          <AllOrders />
        </div>
      )}

      {/* Refund */}
      {active === 3 && (
        <div className="w-full min-h-[40vh] flex items-center justify-center">
          <AllRefundOrders />
        </div>
      )}

      {/* Track Order */}
      {active === 5 && (
        <div className="w-full min-h-[40vh] flex items-center justify-center">
          <TrackOrder />
        </div>
      )}

      {/* Payment Method */}
      {active === 6 && (
        <div className="w-full min-h-[40vh] flex items-center justify-center">
          <PaymentMethod />
        </div>
      )}

      {/* User Address */}
      {active === 7 && (
        <div className="w-full min-h-[40vh] flex items-center justify-center">
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const orders = [
    {
      id: "1",
      name: "Product 1",
      orderItems: [
        {
          name: "Product 1",
          price: 100,
          quantity: 1,
        },
      ],
      orderStatus: "Processing",
    },
  ];

  const coloumns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: Number,
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: Number,
      minWidth: 130,
      flex: 0.8,
    },
    {
      filed: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item.id,
        itemsQty: item.orderItems.length,
        total: "US$" + item.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <div className="w-full pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={coloumns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const AllRefundOrders = () => {
  const orders = [
    {
      id: "1",
      order_items: [
        {
          name: "Product 1",
        },
      ],
      totalPrice: 100,
      orderStatus: "Refunded",
    },
  ];

  const coloumns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Refunded"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item.id,
        itemsQty: item.order_items.length,
        total: "US$" + item.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={coloumns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const TrackOrder = () => {
  const orders = [
    {
      id: "1",
      name: "Product 1",
      orderItems: [
        {
          name: "Product 1",
          price: 100,
          quantity: 1,
        },
      ],
      orderStatus: "Processing",
    },
  ];

  const coloumns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: Number,
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: Number,
      minWidth: 130,
      flex: 0.8,
    },
    {
      filed: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <MdOutlineTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item.id,
        itemsQty: item.orderItems.length,
        total: "US$" + item.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={coloumns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const PaymentMethod = () => {
  return (
    <div className="w-full px-5">
      <div className="w-full flex justify-between items-center">
        <h1 className={`text-[25px] font-[600] text-[#000000ba] mb-2 pb-2`}>
          Payment Methods
        </h1>
        <div classname={`${styles.button} rounded-md`}>
          <span className="text-[#fff]">Add New</span>
        </div>
      </div>
      <br />
      <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10">
        <div className="flex items-center">
          <img alt="" src="../../Assests/paymentmethods.jpeg" />
          <h5 className="pl-5 font-[600]">Aneela Fatima</h5>
        </div>
        <div className="pl-8 flex items-center">
          <h6>123*****</h6>
          <h5 className="pl-6">09/2026</h5>
        </div>
        <div className="min-w-[10%] flex items-center justify-between pl-8">
          <AiOutlineDelete size={25} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

const Address = () => {
  return (
    <div className="w-full px-5">
      <div className="w-full flex justify-between items-center">
        <h1 className={`text-[25px] font-[600] text-[#000000ba] mb-2 pb-2`}>
          My Addresses
        </h1>
        <div classname={`${styles.button} rounded-md`}>
          <span className="text-[#fff]">Add New</span>
        </div>
      </div>
      <br />
      <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10">
        <div className="flex items-center">
          <h5 className="pl-5 font-[600]">Default</h5>
        </div>
        <div className="pl-8 flex items-center">
          <h6>Shorkot City, Jhang</h6>
        </div>
        <div className="pl-8 flex items-center">
          <h6>+92-3023393051</h6>
        </div>
        <div className="min-w-[10%] flex items-center justify-between pl-8">
          <AiOutlineDelete size={25} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
