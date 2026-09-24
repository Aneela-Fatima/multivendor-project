import React from "react";
import styles from "../../../styles/styles";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat bg-cover bg-center ${styles.noramlFlex}`}
      style={{
        backgroundImage: "url('/bgimagegadget.jpeg')",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/35 to-transparent" />

      {/* Hero content */}
      <div
        className={`${styles.section} relative z-10 w-[90%] 800px:w-[60%] animate-[fadeIn_0.6s_ease-out]`}
      >
        {/* Tagline */}
        <p className="text-[#1473E6] text-[14px] 800px:text-[16px] font-[600] tracking-[2px] uppercase">
          Tech Gadgets • Smarter Living
        </p>

        {/* Heading */}
        <h1 className="mt-3 text-[38px] leading-[1.15] 800px:text-[60px] text-[#14213D] font-[700]">
          Latest Gadgets,
          <br />
          <span className="text-[#1473E6]">Bigger Possibilities</span>
        </h1>

        {/* Paragraph */}
        <p className="pt-5 text-[16px] 800px:text-[18px] font-[Poppins] font-[400] text-[#243B53] max-w-[560px] leading-[1.7]">
          Discover the latest gadgets, electronics, and smart accessories from
          trusted sellers. Find the technology you need, all in one place.
        </p>

        {/* Button */}
        <Link to="/products" className="inline-block">
          <div
            className={`${styles.button} mt-6 bg-[#1473E6] hover:bg-[#0D5FC4] rounded-full w-[170px] transition-all duration-300`}
          >
            <span className="text-white font-[Poppins] text-[18px] font-[500]">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
