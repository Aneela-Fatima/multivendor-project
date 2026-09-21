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
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import { addToCart } from "../../../redux/actions/cart";

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

  return (
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 cursor-pointer relative">
        <div classname="flex justify-end "></div>
        <Link to={`${isEvent === true ? `/product/\${data._id}?isEvent=true` : `/product/\${data._id}`}`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="w-full h-[170px] object-contain"
            />
          ) : null}
        </Link>
        <Link to={`${isEvent === true ? `/product/\${data._id}?isEvent=true` : `/product/\${data._id}`}`}>
          <h5 className={`${styles.shop_name}`}>{shopName}</h5>
        </Link>
        <Link to={`/product/${data._id}`}>
          <h4 className="pb-3 font-[500]">
            {data.name.length > 40
              ? data.name.slice(0, 40) + "....."
              : data.name}
          </h4>

          <div className="flex">
            <Ratings ratings={data?.ratings}/>
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex">
              <h5 className={`${styles.productDiscountPrice}`}>
                {data.discountPrice}$
              </h5>
              <h4 className={`${styles.price}`}>
                {data.originalPrice ? data.originalPrice + " $" : null}
              </h4>
            </div>
            <span className="font-[400] text-[17px] text-[#68d284]">
              {data?.sold_out} sold
            </span>
          </div>
        </Link>

        {/* side options */}
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => removeFromWishlistHandler(data)}
              color={click ? "red" : "#333"}
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => addToWishlistHandler(data)}
              color={click ? "red" : "#333"}
              title="Add to wishlist"
            />
          )}
          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color="#333"
            title="Quick View"
          />

          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            onClick={() => addToCartHandler(data._id)}
            color="#444"
            title="Add to cart"
          />
          {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
