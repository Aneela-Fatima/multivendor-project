import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();

  const submitHandle = (i) => {
    navigate(`/products?category=${encodeURIComponent(i.title)}`);
    setDropDown(false);
  };

  return (
    <div className="pt-2 w-[270px] bg-white absolute z-30 rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.12)] overflow-hidden mt-2 animate-[fadeIn_0.15s_ease-out]">
      {categoriesData &&
        categoriesData.map((i, index) => (
          <div
            key={index}
            className={`${styles.noramlFlex} px-2 py-2.5 mx-1.5 my-0.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors duration-150`}
            onClick={() => submitHandle(i)}
          >
            <img
              src={i.image_Url}
              style={{
                width: "26px",
                height: "26px",
                objectFit: "contain",
                marginLeft: "8px",
                userSelect: "none",
              }}
              alt=""
            />
            <h3 className="m-3 text-[15px] select-none">{i.title}</h3>
          </div>
        ))}
    </div>
  );
};

export default DropDown;
