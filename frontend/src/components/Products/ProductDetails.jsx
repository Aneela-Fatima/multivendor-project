import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";

const ProductDetails = ({ data }) => {
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const handleMessageSubmit = () => {
    navigate("/inbox?conversation=nwjnosj7867fghbkjnl");
  };

  return (
    <div className="bg-white ">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%] min-h-screen`}>
          <div className="w-full py-5">
            <div className="w-full flex flex-col 800:flex-row 800:items-center 800:gap-8">
              <div className="w-full 800:w-[42%] flex justify-center">
                <div className="w-full max-w-[520px]">
                  <img
                    src={data.image_Url[select].url}
                    alt=""
                    className="w-full max-w-[500px] mx-auto object-contain"
                  />
                  <div className="w-full flex gap-3 mt-4 justify-center">
                    <div
                      className={`${select === 0 ? "border-2 border-blue-500" : "border border-gray-200"} cursor-pointer p-1 rounded-md`}
                    >
                      <img
                        alt=""
                        src={data?.image_Url[0].url}
                        className="h-[120px] w-[120px] object-cover rounded-md"
                        onClick={() => setSelect(0)}
                      />
                    </div>
                    <div
                      className={`${select === 1 ? "border-2 border-blue-500" : "border border-gray-200"} cursor-pointer p-1 rounded-md`}
                    >
                      <img
                        alt=""
                        src={data?.image_Url[1].url}
                        className="h-[120px] w-[120px] object-cover rounded-md"
                        onClick={() => setSelect(1)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full 800:w-[58%] pt-3 800:pt-0">
                <h1
                  className={`${styles.productTitle} text-[22px] 800:text-[34px] font-[400] mb-2`}
                >
                  {data.name}
                </h1>
                <p className="text-[15px] leading-7 text-gray-600 mb-4">
                  {data.description}
                </p>
                <div className="flex pt-3 items-center gap-3">
                  <h4
                    className={`${styles.productDiscountPrice} text-[16px] 800:text-[20px] font-[400] mb-2`}
                  >
                    {data.discountPrice}$
                  </h4>
                  <h3
                    className={`${styles.price} text-[16px] 800:text-[20px] font-[400] mb-2`}
                  >
                    {data.price ? data.price + "$" : null}
                  </h3>
                </div>
                <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px] ">
                      {count}
                    </span>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>

                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer "
                        onClick={() => setClick(!click)}
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer "
                        onClick={() => setClick(!click)}
                        color={click ? "red" : "#333"}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>

                <div
                  className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center`}
                >
                  <span className="!text-[#fff] flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>

                <div className="flex items-center pt-8">
                  <img
                    src={data.shop.shop_avatar.url}
                    alt="Shop Avatar"
                    className="h-[50px] w-[50px] rounded-full mr-2"
                  />
                  <div className="pr-8">
                    <h3 className={`${styles.shop_name} pb-1 pt-1`}>
                      {data.shop.name}
                    </h3>
                    <h5 className="pb-3 text-[15px]">
                      ({data.shop.ratings}) Ratings
                    </h5>
                  </div>
                  <div
                    className={`${styles.button} bg-[#6443d1] mt-4 rounded-[4px] h-11 flex items-center`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="!text-[#fff] flex items-center">
                      Message Shop <AiOutlineMessage className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ProductDetailsInfo data={data} />
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({ data }) => {
  const [active, setActive] = useState(1);
  return (
    <div className=" bg-[#f5f5f5] px-3 800px:px-10  py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className={`text-[#000000b7] leading-5 px-5 text-[18px] font-[600] cursor-pointer pb-3 800px:text-[20px]"`}
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`}></div>
          ) : null}
        </div>

        <div className="relative">
          <h5
            className={`text-[#000000b7] leading-5 px-5 text-[18px] font-[600] cursor-pointer pb-3 800px:text-[20px]"`}
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? (
            <div className={`${styles.active_indicator}`}></div>
          ) : null}
        </div>

        <div className="relative">
          <h5
            className={`text-[#000000b7] leading-5 px-5 text-[18px] font-[600] cursor-pointer pb-3 800px:text-[20px]"`}
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`}></div>
          ) : null}
        </div>
      </div>

      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] pb-10 whitespace-pre-line 800:text-[18px] leading-8">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Voluptatibus dignissimos at accusantium aliquid quo nesciunt minus
            fugiat perspiciatis vero. Nostrum asperiores exercitationem,
            voluptas quis hic quia quo ratione nam perspiciatis! Deserunt error
            amet, libero nesciunt, officiis facilis molestias ducimus ipsa
            quibusdam sit deleniti! Iusto officia suscipit debitis sunt. Natus
            maiores suscipit vero autem cum? Officia incidunt iure eos sapiente
            aliquam? Nostrum asperiores exercitationem, voluptas quis hic quia
            quo ratione nam perspiciatis! Deserunt error amet, libero nesciunt,
            officiis facilis molestias ducimus ipsa quibusdam sit deleniti!
            Iusto officia suscipit debitis sunt. Natus maiores suscipit vero
            autem cum? Officia incidunt iure eos sapiente aliquam?
          </p>
          <p className="py-2 text-[18px] pb-10 whitespace-pre-line 800:text-[18px] leading-8">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Voluptatibus dignissimos at accusantium aliquid quo nesciunt minus
            fugiat perspiciatis vero. Nostrum asperiores exercitationem,
            voluptas quis hic quia quo ratione nam perspiciatis! Deserunt error
            amet, libero nesciunt, officiis facilis molestias ducimus ipsa
            quibusdam sit deleniti! Iusto officia suscipit debitis sunt. Natus
            maiores suscipit vero autem cum? Officia incidunt iure eos sapiente
            aliquam? Nostrum asperiores exercitationem, voluptas quis hic quia
            quo ratione nam perspiciatis! Deserunt error amet, libero nesciunt,
            officiis facilis molestias ducimus ipsa quibusdam sit deleniti!
            Iusto officia suscipit debitis sunt. Natus maiores suscipit vero
            autem cum? Officia incidunt iure eos sapiente aliquam?
          </p>
          <p className="py-2 text-[18px] pb-10 whitespace-pre-line 800:text-[18px] leading-8">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Voluptatibus dignissimos at accusantium aliquid quo nesciunt minus
            fugiat perspiciatis vero. Nostrum asperiores exercitationem,
            voluptas quis hic quia quo ratione nam perspiciatis! Deserunt error
            amet, libero nesciunt, officiis facilis molestias ducimus ipsa
            quibusdam sit deleniti! Iusto officia suscipit debitis sunt. Natus
            maiores suscipit vero autem cum? Officia incidunt iure eos sapiente
            aliquam? Nostrum asperiores exercitationem, voluptas quis hic quia
            quo ratione nam perspiciatis! Deserunt error amet, libero nesciunt,
            officiis facilis molestias ducimus ipsa quibusdam sit deleniti!
            Iusto officia suscipit debitis sunt. Natus maiores suscipit vero
            autem cum? Officia incidunt iure eos sapiente aliquam?
          </p>
        </>
      ) : null}

      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex items-center justify-center">
          No reviews yet!
        </div>
      ) : null}

      {active === 3 && (
        <div className="w-full min-h-[40vh] block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <div className="flex items-center">
              <img
                src={data.shop.shop_avatar.url}
                alt=""
                className="w-[50px] h-[50px] rounded-full"
              />
              <div className="pl-[5px]">
                <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                <h5 className="pb-2 text-[15px] ">
                  {data.shop.ratings} Ratings
                </h5>
              </div>
            </div>
            <p className="pt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis
              porro illo, molestiae est voluptate debitis, suscipit mollitia
              culpa quos excepturi ab maxime eligendi! Sunt voluptate iste
              voluptas non eveniet delectus!
            </p>
          </div>
          <div className="w-full 800px:[50%] 800px:mt-0 800px:flex flex-col items-end mt-5">
            <div className="text-left">
              <h5 className="font-[600] ">
                Joined on: <span className="font-[500]"> 20-08-2026</span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products: <span className="font-[500]"> 1020</span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews: <span className="font-[500]"> 20</span>
              </h5>
              <Link to="/">
                <div
                  className={`${styles.button} rounded-[4px] h-[39.5px] mt-3`}
                >
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductDetails;
