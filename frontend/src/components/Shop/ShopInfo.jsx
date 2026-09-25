import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect width='50' height='50' fill='%23dbe2ea'/%3E%3Ccircle cx='25' cy='19' r='9' fill='%236b7280'/%3E%3Cpath d='M9 47c2-10 30-10 32 0' fill='%236b7280'/%3E%3C/svg%3E";

const ShopInfo = ({ isOwner }) => {
  const [data,setData] = useState({});
  const { products } = useSelector((state) => state.products);
  const [isLoading,setIsLoading] = useState(false);
  const {id} = useParams();
  const dispatch = useDispatch();
  const totalReviewsLength = products?.reduce((acc, product) => acc + (product.reviews?.length || 0), 0) || 0;
  const totalRatings = products?.reduce((acc, product) => acc + (product.reviews || []).reduce((sum, review) => sum + review.rating, 0), 0) || 0;
  const averageRating = totalRatings / totalReviewsLength || 0;
  useEffect(() => {
    dispatch(getAllProductsShop(id));
    setIsLoading(true);
    axios.get(`${server}/shop/get-shop-info/${id}`).then((res) => {
      setData(res.data.shop);
      setIsLoading(false);
    }).catch((error) => {
      console.log(error);
      setIsLoading(false);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const logoutHandler = async () => {
    try {
      await axios.get(`${server}/shop/logout`, { withCredentials: true });
    } catch (error) {
      console.log(error);
    } finally {
      window.location.href = "/shop-login";
    }
  };
  return (
    <>
    {
      isLoading ? (
        <Loader/>
      ):(
        <div>
      <div className="w-full py-5">
        <div className="w-full flex items-center justify-center">
          <img
            alt=""
            src={data?.avatar?.url || DEFAULT_AVATAR}
            className="w-[150px] h-[150px] object-cover rounded-full"
          />
        </div>
        <h3 className="text-center py-2 text-[20px]">{data.name}</h3>
        <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
          {data.description}
        </p>
      </div>

      <div className="p-3">
        <h5 className="font-[600]">Address</h5>
        <h4 className="text-[#000000a6]">{data.address}</h4>
      </div>

      <div className="p-3">
        <h5 className="font-[600]">Phone Number</h5>
        <h4 className="text-[#000000a6]">{data.phoneNumber}</h4>
      </div>

      <div className="p-3">
        <h5 className="font-[600]">Total Products</h5>
        <h4 className="text-[#000000a6]">{products && products.length}</h4>
      </div>

      <div className="p-3">
        <h5 className="font-[600]">Shop Rating</h5>
        <h4 className="text-[#000000a6]">{averageRating}/5</h4>
      </div>

      <div className="p-3">
        <h5 className="font-[600]">Joined On</h5>
        <h4 className="text-[#000000a6]">{data?.createdAt?.slice(0, 10)}</h4>
      </div>
      {isOwner && (
        <div className="py-3 px-4">
          <Link to="/settings">
          <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
            <span className="text-white">Edit Shop</span>
          </div>
          </Link>
          <div
            className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
            onClick={logoutHandler}
          >
            <span className="text-white">Log Out</span>
          </div>
        </div>
      )}
    </div>
      )
    }
    </>
  );
};

export default ShopInfo;
