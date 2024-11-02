import React, { useEffect, useState } from "react";
import { baseUrl } from "../../config";
import { useAuth } from "../../Auth/AuthContext";
import ecommerce_fetch from "../../services/ecommerce_fetch";
import cardValidator from 'card-validator';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const CreditCardForm = ({ onCreditCardSaved }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const { userData } = useAuth();
  const [expiryDate, setExpiryDate] = useState(null); // Usando DatePicker
  const [expiryError, setExpiryError] = useState("");
  const [cardError, setCardError] = useState("");
  const [cvvError, setCvvError] = useState("");

  const saveCreditCard = async () => {
    const url = `${baseUrl}/creditcard.php`;

    const response = await ecommerce_fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_user: userData.id_user,
        cardNumber: cardNumber.replace(/\s+/g, ''), // Enviar sin espacios
        expiryDate: expiryDate ? expiryDate.toISOString().split('T')[0] : '',
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
    value = value.replace(/\D/g, ""); // Remove non-digits

    const formattedValue = value.replace(/(.{4})/g, "$1 ").trim(); // Format in groups of 4

    const validation = cardValidator.number(value);
    if (!validation.isValid) {
      setCardError("Invalid card number");
    } else {
      setCardError("");
    }

    setCardNumber(formattedValue.slice(0, 19));
  };

  const handleCvvChange = (event) => {
    const { value } = event.target;
    const cvvValidation = cardValidator.cvv(value);

    if (!cvvValidation.isValid) {
      setCvvError("Invalid CVV");
    } else {
      setCvvError("");
    }

    setCvv(value.slice(0, 4)); // CVV typically has 3 or 4 digits
  };

  const handleExpiryDateChange = (date) => {
    setExpiryDate(date);

    const currentDate = new Date();
    if (date < currentDate) {
      setExpiryError("Expiry date is in the past");
    } else {
      setExpiryError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cardError && !cvvError && !expiryError) {
      await saveCreditCard();
    }
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
            <DatePicker
              selected={expiryDate}
              onChange={handleExpiryDateChange}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              placeholderText="MM/YYYY"
              className="form-control"
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
              onChange={handleCvvChange}
            />
            {cvvError && <div className="text-danger">{cvvError}</div>}
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
