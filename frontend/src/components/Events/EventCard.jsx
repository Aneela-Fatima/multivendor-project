import React from "react";
import styles from "../../styles/styles";
import CountDown from "./CountDown";

const EventCard = ({ active }) => {
  return (
    <div
      className={`w-full block bg-white rounded-lg ${active ? "unset" : "mb-12"} lg:flex p-2`}
    >
      <div className="w-full lg:w-[50%] m-auto">
        <img
          src="https://plus.unsplash.com/premium_photo-1681488350342-19084ba8e224?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2hvcHBpbmclMjB3ZWJzaXRlJTIwaWNvbnxlbnwwfHwwfHx8MA%3D%3D"
          alt=""
        />
      </div>
      <div className="w-full lg:w-[50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}>Event Title</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat qui
          fugiat, veritatis fuga aspernatur a hic impedit voluptatem numquam
          laboriosam ea amet soluta ex beatae dolores esse eos, eaque facere.
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis dicta
          eaque, at quo dolores repellat voluptatum veritatis dignissimos ipsa
          aspernatur, odit quod, error reiciendis? Incidunt perspiciatis
          corporis quo totam provident!
        </p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
              1009$
            </h5>
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
              999$
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            120 sold
          </span>
        </div>
        <CountDown />
      </div>
    </div>
  );
};

export default EventCard;
