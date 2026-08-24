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
      <div className={`${styles.section} w-[90%] 800px:w-60% `}>
        <h1
          className={`text-[35px] leading-[1.2] 800px:text-[60px] text-[#3d3a3a] font-[600] capitalize`}
        >
          Best Collection for <br /> Home Decoration
        </h1>
        <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-[#000000ba]">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis
          quaerat iusto aperiam ad <br/> earum mollitia facere {" "} excepturi aspernatur,
          sunt quidem odio cupiditate, illo quisquam <br/> veritatis reprehenderit vel
          deserunt magni sit? <br /> Lorem ipsum dolor sit, amet consectetur
          adipisicing elit. Perferendis quaerat <br/> iusto aperiam ad earum mollitia
          facere excepturi aspernatur, sunt quidem odio cupiditate,<br/> illo
          quisquam veritatis reprehenderit vel deserunt magni sit?
        </p>
        <Link to="/products" className="inline-block">
        <div className={`${styles.button} mt-5`}>
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
