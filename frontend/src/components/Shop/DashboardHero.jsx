import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import styles from "../../styles/styles.js";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order.js";
import { getAllProductsShop } from "../../redux/actions/product.js";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Loader from "../Common/Loader.jsx";

const SellerDashboardHero = () => {
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const { orders, loading: ordersLoading } = useSelector((state) => state.orders);
  const { products, loading: productsLoading } = useSelector((state) => state.products);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (seller?._id) {
      Promise.all([
        dispatch(getAllOrdersOfShop(seller._id)),
        dispatch(getAllProductsShop(seller._id)),
      ]).finally(() => setIsLoading(false));
    }
  }, [dispatch, seller?._id]);

  if (isLoading || ordersLoading || productsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  const availableBalance = seller?.availableBalance?.toFixed(2) || "0.00";

  const getTotalItemsQty = (cart) => {
    return cart?.reduce((acc, item) => acc + (item.qty || 1), 0) || 0;
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        const status = params.row.status;
        if (status === "Delivered") return "greenColor";
        if (status === "Processing refund" || status === "Refund Success") return "orangeColor";
        return "redColor";
      },
    },
    { field: "itemsQty", headerName: "Total Items", type: "number", minWidth: 130, flex: 0.7 },
    { field: "total", headerName: "Total", type: "number", minWidth: 130, flex: 0.8 },
    {
      field: "action",
      flex: 1,
      minWidth: 150,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/shop/order/${params.row.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} className="text-voltage" />
          </Button>
        </Link>
      ),
    },
  ];

  const rows =
    orders?.map((item) => ({
      id: item._id,
      itemsQty: getTotalItemsQty(item.cart),
      total: `US$ ${item.totalPrice || 0}`,
      status: item.status || "Processing",
    })) || [];

  const statCard = (icon, label, sublabel, value, linkTo, linkLabel) => (
    <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white border border-divider rounded-lg px-4 py-5">
      <div className="flex items-center">
        {icon}
        <h3 className="font-body text-[15px] leading-5 font-[500] text-ink/60 pl-2">
          {label} {sublabel && <span className="text-[13px]">{sublabel}</span>}
        </h3>
      </div>
      <h5 className="pt-2 pl-[32px] price-tag text-[20px] text-ink inline-block mt-1">{value}</h5>
      <Link to={linkTo}>
        <h5 className="pt-4 pl-2 text-voltage hover:underline cursor-pointer font-body text-sm">
          {linkLabel}
        </h5>
      </Link>
    </div>
  );

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-display font-[600] text-ink pb-4">Overview</h3>

      <div className="w-full block 800px:flex items-center justify-between gap-4">
        {statCard(
          <AiOutlineMoneyCollect size={26} className="text-voltage" />,
          "Account Balance",
          "(10% service charge)",
          `$${availableBalance}`,
          "/dashboard-withdraw-money",
          "Withdraw Money",
        )}
        {statCard(
          <MdBorderClear size={26} className="text-copper" />,
          "All Orders",
          null,
          orders?.length || 0,
          "/dashboard-all-orders",
          "View Orders",
        )}
        {statCard(
          <AiOutlineMoneyCollect size={26} className="text-stock" />,
          "All Products",
          null,
          products?.length || 0,
          "/dashboard-all-products",
          "View Products",
        )}
      </div>

      <br />

      <h3 className="text-[22px] font-display font-[600] text-ink pb-2">Latest Orders</h3>
      <div className="w-full min-h-[45vh] bg-white border border-divider rounded-lg">
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            "& .greenColor": { color: "#1FAA59", fontWeight: "bold" },
            "& .orangeColor": { color: "#F5A623", fontWeight: "bold" },
            "& .redColor": { color: "#131A2B", fontWeight: "bold" },
          }}
        />
      </div>
    </div>
  );
};

export default SellerDashboardHero;