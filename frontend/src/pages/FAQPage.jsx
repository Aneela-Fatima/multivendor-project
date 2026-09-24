import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const faqData = [
  {
    question: "How do I track my order?",
    answer:
      "Once your order ships, you can track it any time from Profile > My Orders. Open the order to see its live status — Processing, Shipped, or Delivered — updated by the seller.",
  },
  {
    question: "What is your return and refund policy?",
    answer:
      "If something isn't right with your order, open it from My Orders and click Request Refund. The seller reviews the request, and once approved, your refund is processed back to your original payment method.",
  },
  {
    question: "How long does shipping usually take?",
    answer:
      "We typically process and ship orders within 1-2 business days. Depending on your location, delivery can take an additional 2-7 days after that.",
  },
  {
    question: "How do I become a seller on ShopO?",
    answer:
      'Click "Become Seller" in the header, fill in your shop details, and verify your email. Once activated, you can log in to your Shop Dashboard and start listing products right away.',
  },
  {
    question: "What payment methods are supported?",
    answer:
      "Cash on Delivery is available on every order — pay the delivery partner when your package arrives. We're working on adding online payment options soon.",
  },
  {
    question: "Can I message a seller directly?",
    answer:
      'Yes. Open any product page and click "Send Message" to start a conversation with the seller — handy for questions about sizing, stock, or delivery estimates before you buy.',
  },
  {
    question: "How do I apply a coupon code at checkout?",
    answer:
      "On the checkout page, enter your coupon code in the discount field and click Apply. Coupons are shop-specific, so a code only applies to items from the shop that issued it.",
  },
  {
    question: "Is my personal information safe?",
    answer:
      "Yes. Your account details are securely stored, and we never share your personal information with sellers beyond what's needed to fulfill and deliver your order.",
  },
];

const FAQPage = () => {
  return (
    <div>
      <Header activeHeading={5} />
      <Faq />
      <Footer />
    </div>
  );
};

const Faq = () => {
  const [activeTab, setActiveTab] = useState(0);
  const toogleTab = (tab) => {
    setActiveTab(activeTab === tab ? 0 : tab);
  };

  return (
    <div className={`${styles.section} my-10`}>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-500 mt-2">
          Everything you need to know about shopping and selling on ShopO
        </p>
      </div>
      <div className="mx-auto max-w-3xl space-y-3">
        {faqData.map((item, index) => {
          const tab = index + 1;
          const isOpen = activeTab === tab;
          return (
            <div
              key={item.question}
              className={`rounded-2xl border bg-white transition-all duration-200 ${
                isOpen
                  ? "border-[#f63b60]/30 shadow-[0_8px_25px_rgba(0,0,0,0.06)]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <button
                type="button"
                className="flex items-center justify-between w-full px-5 py-4 text-left"
                onClick={() => toogleTab(tab)}
              >
                <span className="text-[16px] font-medium text-gray-900 pr-4">
                  {item.question}
                </span>
                <span
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isOpen ? "bg-[#f63b60] text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {isOpen ? <AiOutlineMinus size={16} /> : <AiOutlinePlus size={16} />}
                </span>
              </button>
              <div
                className={`px-5 overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-[240px] pb-5" : "max-h-0"
                }`}
              >
                <p className="text-[15px] text-gray-500 leading-6">{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default FAQPage;
