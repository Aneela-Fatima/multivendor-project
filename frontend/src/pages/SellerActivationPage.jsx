import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          const res = await axios.post(`${server}/shop/activation`, {
            activation_token,
          });
          console.log(res.data.message);
        } catch (error) {
          const message =
            error.response?.data?.message ||
            "Activation failed. Please try again.";
          console.log(message);
          setErrorMessage(message);
          setError(true);
        }
      };
      activationEmail();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {error ? (
        <p>{errorMessage}</p>
      ) : (
        <p>Your Account has been created successfully!</p>
      )}
    </div>
  );
};

export default SellerActivationPage;
