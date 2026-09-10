import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import styles from "../../styles/styles";
import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllCoupons = () => {
  const [open, setOpen] = useState();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [value, setValue] = useState(null);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const [selectedProducts, setSelectedProducts] = useState(null);

  const dispatch = useDispatch();

  const loadCoupons = React.useCallback(() => {
    if (!seller?._id) return;

    setIsLoading(true);
    axios
      .get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLoading(false);
        setCoupons(
          Array.isArray(res.data?.couponCodes) ? res.data.couponCodes : [],
        );
      })
      .catch((error) => {
        setIsLoading(false);
        setCoupons([]);
      });
  }, [seller?._id]);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          minAmount,
          maxAmount,
          selectedProducts,
          value,
          shop: seller,
        },
        { withCredentials: true },
      );

      toast.success("Coupon Code created Successfully!");
      setOpen(false);
      setName("");
      setValue("");
      setMinAmount("");
      setMaxAmount("");
      setSelectedProducts(null);
      loadCoupons();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Product ID",
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
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "Delete",
      type: "number",
      sortable: "false",
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  coupons.forEach((item) => {
    row.push({
      id: item._id,
      name: item.name,
      price: item.value + "%",
    });
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mt-10 pt-1 mx-8 bg-white ">
          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white">Create Coupoun Code</span>
            </div>
          </div>

          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            autoHeight
            disableSelectionOnClick
          />
          {open && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#00000062] p-4">
              <div className="w-full max-w-[40rem] max-h-[85vh] overflow-hidden rounded-xl bg-white shadow-2xl">
                <div className="flex items-center justify-end border-b border-gray-200 px-4 py-3">
                  <RxCross1
                    size={28}
                    className="cursor-pointer rounded-full p-1 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => setOpen(false)}
                  />
                </div>

                <div className="max-h-[calc(85vh-64px)] overflow-y-auto px-5 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <h5 className="pb-4 text-center text-[30px] font-Poppins font-semibold text-gray-800">
                    Create Coupon code
                  </h5>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="pb-2 block text-sm font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={name}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:text-sm"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your coupon code name...."
                      />
                    </div>

                    <div>
                      <label className="pb-2 block text-sm font-medium text-gray-700">
                        Discount percentage{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="value"
                        value={value}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:text-sm"
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Enter your coupon code value...."
                      />
                    </div>

                    <div>
                      <label className="pb-2 block text-sm font-medium text-gray-700">
                        Min Amount
                      </label>
                      <input
                        type="number"
                        name="minAmount"
                        value={minAmount}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:text-sm"
                        onChange={(e) => setMinAmount(e.target.value)}
                        placeholder="Enter your coupon code min amount...."
                      />
                    </div>

                    <div>
                      <label className="pb-2 block text-sm font-medium text-gray-700">
                        Max Amount
                      </label>
                      <input
                        type="number"
                        name="maxAmount"
                        value={maxAmount}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:text-sm"
                        onChange={(e) => setMaxAmount(e.target.value)}
                        placeholder="Enter your coupon code max amount...."
                      />
                    </div>

                    <div>
                      <label className="pb-2 block text-sm font-medium text-gray-700">
                        Selected products
                      </label>
                      <select
                        className="mt-1 block h-[42px] w-full rounded-md border border-gray-300 bg-white px-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:text-sm"
                        value={selectedProducts}
                        onChange={(e) => setSelectedProducts(e.target.value)}
                      >
                        <option value="Choose a selected product">
                          Choose a selected product
                        </option>
                        {products &&
                          products.map((i) => (
                            <option value={i.name} key={i.name}>
                              {i.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="pt-2">
                      <input
                        type="submit"
                        value="Create"
                        className="mt-2 block w-full cursor-pointer rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;
