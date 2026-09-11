import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import { backend_url } from "../../../server";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";

const ProductCard = ({ data }) => {
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);

  if (!data) {
    return (
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 text-sm text-gray-500 flex items-center justify-center">
        Product unavailable.
      </div>
    );
  }

  const productName = data.name || "Product";
  const productSlug = productName.replace(/\s+/g, "-");
  const imageUrl = data.images?.[0] ? `${backend_url}${data.images[0]}` : "";
  const shopName = data.shop?.name || "Shop";

  return (
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 cursor-pointer relative">
        <div classname="flex justify-end "></div>
        <Link to={`/product/${productSlug}`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={productName}
              className="w-full h-[170px] object-contain"
            />
          ) : null}
        </Link>
        <Link to="/">
          <h5 className={`${styles.shop_name}`}>{shopName}</h5>
        </Link>
        <Link to={`/product/${productSlug}`}>
          <h4 className="pb-3 font-[500]">
            {productName.length > 40
              ? productName.slice(0, 40) + "....."
              : productName}
          </h4>

          <div className="flex">
            <AiFillStar
              className="mr-2 cursor-pointer"
              color="#F6BA00"
              size={20}
            />
            <AiFillStar
              className="mr-2 cursor-pointer"
              color="#F6BA00"
              size={20}
            />
            <AiFillStar
              className="mr-2 cursor-pointer"
              color="#F6BA00"
              size={20}
            />
            <AiFillStar
              className="mr-2 cursor-pointer"
              color="#F6BA00"
              size={20}
            />
            <AiOutlineStar
              className="mr-2 cursor-pointer"
              color="#F6BA00"
              size={20}
            />
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
              {data.sold_out}
            </span>
          </div>
        </Link>

        {/* side options */}
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => setClick(!click)}
              color={click ? "red" : "#333"}
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => setClick(!click)}
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
            onClick={() => setOpen(!open)}
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
