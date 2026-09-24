import React from "react";
import styles from "../../../styles/styles";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat bg-cover bg-center ${styles.noramlFlex}`}
      style={{
        backgroundImage:
          "url(https://t4.ftcdn.net/jpg/02/32/16/07/360_F_232160763_FuTBWDd981tvYEJFXpFZtolm8l4ct0Nz.jpg)",
      }}
    >
      {/* readability overlay so text stays crisp over any photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />

      <div className={`${styles.section} relative w-[90%] 800px:w-60% animate-[fadeIn_0.6s_ease-out]`}>
        <h1
          className={`text-[35px] leading-[1.2] 800px:text-[60px] text-[#3d3a3a] font-[600] capitalize`}
        >
          Best Collection for <br /> Home Decoration
        </h1>
        <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-[#000000ba] max-w-[520px]">
          Curated home decor pieces picked for quality and style — refresh
          your space with collections from trusted sellers, delivered
          straight to your door.
        </p>
        <Link to="/products" className="inline-block">
          <div
            className={`${styles.button} mt-5 bg-gradient-to-r from-[#f63b60] to-[#d5364f] rounded-full w-[170px]`}
          >
            <span className="text-[#fff] font-[Poppins] text-[18px]">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
