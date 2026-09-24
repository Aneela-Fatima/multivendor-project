import React from "react";
import styles from "../../../styles/styles";
import { brandingData, categoriesData } from "../../../static/data";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={`${styles.section} hidden sm:block`}>
        <div
          className={`branding my-12 flex justify-between w-full ${styles.card} bg-white p-5`}
        >
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-start" key={index}>
                {i.icon}
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base">{i.title}</h3>
                  <p className="text-xs md:text-sm">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div
        className={`${styles.section} bg-white p-6 rounded-2xl mb-12`}
        id="categories"
      >
        <div className="text-center mb-8">
          <h2 className="text-[26px] font-semibold text-[#3d3a3a]">Shop by Category</h2>
          <p className="text-gray-500 text-sm mt-1">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categoriesData &&
            categoriesData.map((i) => {
              const handleSubmit = (i) => {
                navigate(`/products?category=${i.title}`);
              };
              return (
                <div
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:border-transparent transition-all duration-300"
                  key={i.id}
                  onClick={() => handleSubmit(i)}
                >
                  <div className="w-[64px] h-[64px] rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img
                      src={i.image_Url}
                      className="w-[42px] h-[42px] object-contain transition-transform duration-300 group-hover:scale-110"
                      alt={i.title}
                    />
                  </div>
                  <h5 className="text-[13px] leading-[1.3] font-medium text-center text-[#333]">
                    {i.title}
                  </h5>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Categories;
