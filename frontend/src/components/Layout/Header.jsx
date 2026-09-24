import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { categoriesData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { backend_url } from "../../server";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";
import logoIcon from "../../Assests/logo-icon.png";

const Header = ({ activeHeading }) => {
   const { cart } = useSelector((state) => state.cart);  
  const { wishlist } = useSelector((state) => state.wishlist);

  const { allProducts } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSeacrchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase()),
      );
    setSearchData(filteredProducts);
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });
  return (
    <>
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[60px] 800px:my-[20px] 800px:flex items-center justify-between gap-6">
          <div className="shrink-0">
            <Link to="/">
              <img
                src={logoIcon}
                alt="ShopO"
                className="h-11 w-auto"
              />
            </Link>
          </div>
          {/* Serch box */}
          <div className="w-full max-w-[560px] relative">
            <div className="relative">
              <AiOutlineSearch
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search Product...."
                value={searchTerm}
                onChange={handleSeacrchChange}
                className="h-[44px] w-full pl-11 pr-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#f63b60]/30 focus:border-[#f63b60]/40 transition-shadow"
              />
            </div>
            {searchData && searchData.length !== 0 ? (
              <div className="absolute w-full bg-white shadow-[0_15px_35px_rgba(0,0,0,0.12)] rounded-2xl z-[9] p-2 mt-2 max-h-[400px] overflow-y-auto">
                {searchData &&
                  searchData.map((i, index) => {

                    return (
                      <Link to={`/product/${i._id}`} key={i._id || index}>
                        <div className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                          <img
                            src={`${backend_url}${i.images[0]}`}
                            alt=""
                            className="w-[42px] h-[42px] rounded-lg object-cover"
                          />
                          <h1 className="text-[14px] font-medium truncate">{i.name}</h1>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : null}
          </div>

          <Link to="/shop-create" className="shrink-0">
            <div className="h-[44px] px-6 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#352e79] to-[#4b3fb0] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
              <span className="text-white font-medium text-[15px]">Become Seller</span>
              <IoIosArrowForward className="text-white" />
            </div>
          </Link>
        </div>
      </div>
      <div
        className={`${active === true ? "shadow-sm fixed top-0 left-0 z-10" : null} transition hidden 800px:flex items-center justify-between w-full bg-gradient-to-r from-[#352e79] to-[#443a9e] h-[70px] shadow-md`}
      >
        <div
          className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
        >
          {/* catagories */}
          <div onClick={() => setDropDown(!dropDown)}>
            <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
              <BiMenuAltLeft size={26} className="absolute top-[18px] left-3 text-[#352e79]" />
              <button
                className="h-[100%] w-full flex justify-between items-center pl-11 bg-white font-sans text-[15px] font-medium select-none rounded-full shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                All Categories
              </button>
              <IoIosArrowDown
                size={18}
                className={`absolute right-4 top-[21px] cursor-pointer transition-transform duration-200 ${
                  dropDown ? "rotate-180" : ""
                }`}
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              ) : null}
            </div>
          </div>
          {/* nav items */}
          <div className={`${styles.noramlFlex}`}>
            <Navbar active={activeHeading} />
          </div>
          {/*  */}
          <div className="flex items-center gap-1">
            <div
              className="relative cursor-pointer w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              onClick={() => setOpenWishlist(true)}
            >
              <AiOutlineHeart size={24} color="rgb(255 255 255 / 90%" />
              {wishlist && wishlist.length > 0 && (
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] min-w-[16px] h-4 px-[3px] text-white font-sans text-[11px] leading-4 text-center">
                  {wishlist.length}
                </span>
              )}
            </div>

            <div
              className="relative cursor-pointer w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={24} color="rgb(255 255 255 / 90%" />
              {cart && cart.length > 0 && (
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] min-w-[16px] h-4 px-[3px] text-white font-sans text-[11px] leading-4 text-center">
                  {cart.length}
                </span>
              )}
            </div>

            <div className="relative cursor-pointer ml-1">
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={
                      user?.avatar
                        ? typeof user.avatar === "string"
                          ? user.avatar.startsWith("http")
                            ? user.avatar
                            : `${backend_url}${user.avatar}`
                          : user.avatar.url || ""
                        : "https://via.placeholder.com/35"
                    }
                    alt=""
                    className="w-[38px] h-[38px] rounded-full object-cover ring-2 ring-white/40 hover:ring-white/70 transition-all"
                  />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <CgProfile size={24} color="rgb(255 255 255 / 90%" />
                </Link>
              )}
            </div>
            {/* cart popup */}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

            {/* wishlist popup */}
            {openWishlist ? (
              <Wishlist setOpenWishlist={setOpenWishlist} />
            ) : null}
          </div>
        </div>
      </div>

      {/* mobile header */}
      <div
        className={` ${active === true ? "shadow-sm fixed top-0 left-0 z-10" : null} 
        w-full h-[60px] fixed bg-[#fff] z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft
              size={40}
              className="ml-4"
              onClick={() => setOpen(true)}
            />
          </div>
          <div>
            <Link to="/">
              <img
                alt="ShopO"
                src={logoIcon}
                className="mt-2 h-9 w-auto cursor-pointer"
              />
            </Link>
          </div>
          <div>
            <div className="relative mr-[20px] ">
              <AiOutlineShoppingCart size={30} />
              <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right">
                {cart && cart.length}
              </span>
            </div>
          </div>
        </div>

        {/* header sidebar */}
        {open && (
          <div className=" w-full bg-[#0000005f] z-20 h-full top-0 left-0">
            <div className="fixed w-[60%] bg-[#fff] h-screen top-0 left-0 z-10 overflow-y-scroll">
              <div className="w-full justify-between flex pr-3">
                <div>
                  <div className="relative mr-[15px]">
                    <AiOutlineHeart size={30} className="mt-5 ml-3" />
                    <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right">
                      0
                    </span>
                  </div>
                </div>
                <RxCross1
                  size={30}
                  className="ml-4 mt-5"
                  onClick={() => setOpen(false)}
                />
              </div>

              <div className="my-8 w-[92%] m-auto h-[40px] relative">
                <input
                  type="search"
                  placeholder="Search Product"
                  className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
                  value={searchTerm}
                  onChange={handleSeacrchChange}
                />

                {searchData && (
                  <div className="absolute bg-[#fff] z-10 shadow w-full left-0 p-3">
                    {searchData.map((i) => {
                      return (
                        <Link to={`/product/${i._id}`} key={i._id}>
                          <div className="flex items-center ">
                            <img
                              alt=""
                              src={`${backend_url}${i.images?.[0]}`}
                              className="w-[50px] mr-2"
                            />
                            <h5>{i.name}</h5>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <Navbar active={activeHeading} />
              <div className={`${styles.button} ml-4 rounded-[4px]`}>
                <Link to="/shop-create">
                  <h1 className="text-[#ffff] flex items-center ">
                    Become Seller <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>
              <br />
              <br />
              <br />
              <div className="flex w-full justify-center">
                {isAuthenticated ? (
                  <div>
                    <Link to="/profile">
                      <img
                        alt=""
                        src={
                          user?.avatar
                            ? typeof user.avatar === "string"
                              ? user.avatar.startsWith("http")
                                ? user.avatar
                                : `${backend_url}${user.avatar}`
                              : user.avatar.url || ""
                            : "https://via.placeholder.com/60"
                        }
                        className="w-[60px] h-[60px] rounded-full border-[3px] border-[#0eae88] object-cover"
                      />
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-[18px] pr-[10px] text-[#000000b7]"
                    >
                      Login /
                    </Link>
                    <Link
                      to="/sign-up"
                      className="text-[18px] text-[#000000b7]"
                    >
                      SignUp
                    </Link>
                  </>
                )}
                {}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
