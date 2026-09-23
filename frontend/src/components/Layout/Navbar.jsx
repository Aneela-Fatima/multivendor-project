import React from "react";
import styles from "../../styles/styles";
import { navItems } from "../../static/data";
import { Link } from "react-router-dom";

const Navbar = ({ active }) => {
  return (
    <div className={`block 800px:${styles.noramlFlex}`}>
      {navItems &&
        navItems.map((i, index) => (
          <div className="flex" key={i.url}>
            <Link
              to={i.url}
              className={`${active === index + 1 ? "text-[#066909]" :"text-black 800px:text-[#ffffff]"} pb-[30px] 800px:pb-0 font-[500] px-6 cursor-pointer`}
            >
              {i.title}
            </Link>
          </div>
        ))} 
    </div>
  );
};

export default Navbar;
