import React, { useState, useEffect } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductDetails from "../components/Products/ProductDetails";
import { useParams } from "react-router-dom";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useSelector } from "react-redux";

const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.products);
  const { id } = useParams();
  const [data, setData] = useState(null);
  onst[searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");

  useEffect(() => {
    if (eventData !== null) {
      const data = allEvents && allEvents.find((i) => i._id === id);
      setData(data);
    } else {
      const data = allProducts && allProducts.find((i) => i._id === id);
      setData(data);
    }
  }, [data, allProducts, id, allEvents]);

  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {
        !eventData && (
          <>
            {data && <SuggestedProduct data={data} />}
          </>
        )
      }
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
