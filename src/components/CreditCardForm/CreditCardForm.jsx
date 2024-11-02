import React, { useEffect, useState } from "react";
import { baseUrl } from "../../config";
import { useAuth } from "../../Auth/AuthContext";
import ecommerce_fetch from "../../services/ecommerce_fetch";

export const CreditCardForm = ({ onCreditCardSaved }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const { userData } = useAuth();
  const [expiryError, setExpiryError] = useState("");
  const [cardError, setCardError] = useState("");

  const saveCreditCard = async () => {
    const url = `${baseUrl}/creditcard.php`;

    const response = await ecommerce_fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_user: userData.id_user,
        cardNumber,
        expiryDate,
        cvv,
        name,
      }),
    });

    if (response.status === 201) {
      const data = await response.json();

      onCreditCardSaved(data.data);
    } else {
      console.log("Error saving credit card");
    }
  };

  const handleCardNumberChange = (event) => {
    let { value } = event.target;

    value = value.replace(/\D/g, "");

    const formattedValue = value.replace(/(.{4})/g, "$1 ").trim();

    if (formattedValue.replace(/\s/g, "").length > 16) {
      return;
    } else {
      setCardError("");
      setCardNumber(formattedValue);
    }
  };

  const handleExpiryDateChange = (event) => {
    let { value } = event.target;

    value = value.replace(/\D/g, "");

    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }

    if (value.length === 5) {
      const month = parseInt(value.slice(0, 2), 10);
      const year = parseInt(value.slice(3, 5), 10) + 2000;

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      if (month < 1 || month > 12) {
        setExpiryError("Invalid date");
      } else if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        setExpiryError(
          "Invalid date"
        );
      } else {
        setExpiryError("");
      }
    } else {
      setExpiryError("");
    }

    setExpiryDate(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await saveCreditCard();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-3">
        <label className="text-white">Card Number</label>
        <input
          type="text"
          className="form-control"
          value={cardNumber}
          placeholder="1234 5678 9012 3456"
          onChange={handleCardNumberChange}
        />
        {cardError && <div className="text-danger">{cardError}</div>}
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="text-white">Expiry Date</label>
            <input
              type="text"
              className="form-control"
              value={expiryDate}
              placeholder="MM/YY"
              onChange={handleExpiryDateChange}
            />
            {expiryError && <div className="text-white">{expiryError}</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="text-white">CVV</label>
            <input
              type="text"
              className="form-control"
              value={cvv}
              placeholder="123"
              onChange={(event) => setCvv(event.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="form-group mb-3">
        <label className="text-white">Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          placeholder="Full name"
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-success btn-block mt-4">
        Save Credit Card
      </button>
    </form>
  );
};
