import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getAllEventsShop } from "../../redux/actions/event";
import {deleteEvent} from "../../redux/actions/event";
import Loader from "../Layout/Loader";

const AllEvents = () => {
  const { events = [], isLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllEventsShop(seller._id));
    }
  }, [dispatch, seller?._id]);


  const handleDelete = (id) =>{
    dispatch(deleteEvent(id));
    window.location.reload();
  }

  const columns = [
    {
      field: "id",
      headerName: "Event ID",
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Stock",
      minWidth: 80,
      flex: 0.5,
      type: "number",
    },
    {
      field: "sold",
      headerName: "Sold out",
      minWidth: 130,
      flex: 0.6,
      type: "number",
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "Preview",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        const d = params.row.name;
        const product_name = d.replace(/\s+/g, "-");
        return (
          <>
            <Link to={`/product/${product_name}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "Delete",
      type: "number",
      sortable: "false",
      renderCell: (params) => {
        return (
          <>
            <Button
            onClick={()=>handleDelete(params.id)}
            >
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  events &&
    events.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "US$ " + item.discountPrice,
        Stock: item.stock,
        sold: 10,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mt-10 pt-1 mx-8 bg-white ">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            autoHeight
            disableSelectionOnClick
          />
        </div>
      )}
    </>
  );
};

export default AllEvents;
