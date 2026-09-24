import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import { backend_url } from "../../../server";
import { useDispatch, useSelector } from "react-redux";
import {addToWishlist, removeFromWishlist} from "../../../redux/actions/wishlist"


import { toast } from "react-toastify";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { addToCart } from "../../../redux/actions/cart";
import Ratings from "../../Products/Ratings";

const ProductCard = ({ data,isEvent }) => {
  const {wishlist} = useSelector((state)=>state.wishlist)
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data._id]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
    toast.error("Item removed from wishlist!");
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
    toast.success("Item added to wishlist successfully!");
  };

  const addToCartHandler = (id) =>{
    const isItemExist = cart && cart.find((i) => i._id === id)
    if(isItemExist){
      toast.error("Item already in cart")
    }else{
      if(data.stock < 1){
        toast.error("Product stock limited!")
      }else{
        const cartData = {...data,qty:1}
      dispatch(addToCart(cartData));
      toast.success("Item added to cart successfully!") 
      }
    }
  }

  const [open, setOpen] = useState(false);

  if (!data) {
    return (
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 text-sm text-gray-500 flex items-center justify-center">
        Product unavailable.
      </div>
    );
  }


  const imageUrl = data.images?.[0] ? `${backend_url}${data.images[0]}` : "";
  const shopName = data.shop?.name || "Shop";
  const reviewCount = data.reviews?.length || 0;
  const reviewRating =
    data.reviews?.reduce(
      (total, review) => total + Number(review.rating || 0),
      0,
    ) || 0;
  const averageRating = data.rating || (reviewCount ? reviewRating / reviewCount : 0);

  const productLink = `/product/${data._id}${isEvent === true ? "?isEvent=true" : ""}`;

  return (
    <>
      <div className="group w-full h-[390px] bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 p-3 cursor-pointer relative overflow-hidden">
        <Link to={productLink}>
          <div className="w-full h-[180px] flex items-center justify-center overflow-hidden rounded-xl bg-gray-50">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={data.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : null}
          </div>
        </Link>
        <Link to={productLink}>
          <h5 className={`${styles.shop_name} hover:text-blue-600 transition-colors`}>{shopName}</h5>
        </Link>
        <Link to={productLink}>
          <h4 className="pb-3 font-[500] group-hover:text-[#f63b60] transition-colors">
            {data.name.length > 40
              ? data.name.slice(0, 40) + "....."
              : data.name}
          </h4>

          <div className="flex">
            <Ratings rating={averageRating} />
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex items-baseline">
              <h5 className={`${styles.productDiscountPrice}`}>
                ${data.discountPrice}
              </h5>
              <h4 className={`${styles.price}`}>
                {data.originalPrice ? "$" + data.originalPrice : null}
              </h4>
            </div>
            <span className="font-[400] text-[15px] text-[#68d284]">
              {data?.sold_out} sold
            </span>
          </div>
        </Link>

        {/* side options */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() =>
              click ? removeFromWishlistHandler(data) : addToWishlistHandler(data)
            }
            title={click ? "Remove from wishlist" : "Add to wishlist"}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
          >
            {click ? (
              <AiFillHeart size={20} color="#f63b60" />
            ) : (
              <AiOutlineHeart size={20} color="#333" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            title="Quick View"
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
          >
            <AiOutlineEye size={20} color="#333" />
          </button>
          <button
            type="button"
            onClick={() => addToCartHandler(data._id)}
            title="Add to cart"
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
          >
            <AiOutlineShoppingCart size={21} color="#444" />
          </button>
          {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
