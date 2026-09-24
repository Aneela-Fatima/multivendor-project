import React from "react";
import { AiFillFacebook, AiFillInstagram, AiFillYoutube } from "react-icons/ai";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";
import { Link } from "react-router-dom";
import paymentMethodsImg from "../../Assests/paymentmethods.jpeg";

const Footer = () => {
  return (
    <div className="bg-[#0b0b12] text-white">
      {/* Newsletter */}
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:justify-between md:items-center gap-6 px-6 py-10">
        <h1 className="lg:text-4xl text-3xl leading-normal font-semibold">
          <span className="text-[#56d879]">Subscribe</span> us to get news
          <br />
          events and offers
        </h1>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
        >
          <input
            type="email"
            required
            placeholder="Enter your email..."
            className="text-gray-800 sm:w-72 w-full py-2.5 rounded-full px-5 focus:outline-none focus:ring-2 focus:ring-[#56d879]/40"
          />
          <button
            type="submit"
            className="bg-[#56d879] hover:bg-[#3fc169] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 px-6 py-2.5 rounded-full text-[#0b0b12] font-semibold"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="border-t border-white/10" />

      {/* Link columns */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-10 px-6 py-14">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt="ShopO"
            style={{ filter: "brightness(0) invert(1)" }}
            className="h-8"
          />
          <p className="text-gray-400 text-sm mt-4 leading-6">
            The home and elements needed to create beautiful products.
          </p>
          <div className="flex items-center gap-4 mt-4">
            {[AiFillFacebook, AiFillInstagram, AiFillYoutube].map((Icon, i) => (
              <button
                key={i}
                type="button"
                aria-label="Social link"
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#56d879] hover:text-[#0b0b12] transition-colors duration-200"
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        <div className="text-center sm:text-left">
          <h1 className="mb-3 font-semibold text-[15px]">Company</h1>
          <ul className="space-y-2">
            {footerProductLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.link}
                  className="text-gray-400 hover:text-[#56d879] transition-colors duration-200 text-sm"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center sm:text-left">
          <h1 className="mb-3 font-semibold text-[15px]">Shop</h1>
          <ul className="space-y-2">
            {footercompanyLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.link}
                  className="text-gray-400 hover:text-[#56d879] transition-colors duration-200 text-sm"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center sm:text-left">
          <h1 className="mb-3 font-semibold text-[15px]">Support</h1>
          <ul className="space-y-2">
            {footerSupportLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.link}
                  className="text-gray-400 hover:text-[#56d879] transition-colors duration-200 text-sm"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10" />

      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-6 text-gray-400 text-sm">
        <span>© 2026 ShopO. All rights reserved.</span>
        <span className="flex gap-2">
          <Link to="/terms" className="hover:text-[#56d879] transition-colors">
            Terms
          </Link>
          ·
          <Link to="/privacy" className="hover:text-[#56d879] transition-colors">
            Privacy Policy
          </Link>
        </span>
        <img
          alt="Accepted payment methods"
          className="h-8 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-200"
          src={paymentMethodsImg}
        />
      </div>
    </div>
  );
};

export default Footer;
