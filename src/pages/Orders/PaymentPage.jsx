import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PaymentPage.css";
import { OrderContext } from "../../pages/Orders/OrderContexts";
import { baseUrl } from "../../config";
import { useAuth } from "../../Auth/AuthContext.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreditCardForm } from "../../components/CreditCardForm/CreditCardForm.jsx";
import { Button, Modal } from "react-bootstrap";
import ecommerce_fetch from '../../services/ecommerce_fetch';

function PaymentPage() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [addressFromAPI, setAddressFromAPI] = useState(false); // Estado adicional para verificar si viene de la API
  const [nit, setNit] = useState("");
  const [cardReferencer, setCardReferencer] = useState("");
  const navigate = useNavigate();
  const { orderItems, createOrder } = useContext(OrderContext);
  const { userData } = useAuth();
  const [shippingPrice, setShippingPrice] = useState(0);
  const [minPurchaseAmount, setMinPurchaseAmount] = useState(0);
  const [hasCreditCard, setHasCreditCard] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const subtotal = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const surcharge = subtotal < minPurchaseAmount ? shippingPrice : 0;
  const total = subtotal + surcharge;

  useEffect(() => {
    ecommerce_fetch(`${baseUrl}/config.php`)
      .then((response) => response.json())
      .then((data) => {
        setShippingPrice(parseFloat(data.shipping_price || 0));
        setMinPurchaseAmount(parseFloat(data.min_purchase_amount || 0));
      })
      .catch((error) => {
        console.error("Error fetching configuration:", error);
      });

    const id_user = userData.id_user;
    ecommerce_fetch(`${baseUrl}/users.php?id_user=${id_user}`)
      .then((response) => response.json())
      .then((data) => {
        const user = data.data[0];
        if (user) {
          setName(user.Name || "");
          setCardNumber(
            user.Card_Number
              ? `**** **** **** ${user.Card_Number.slice(-4)}`
              : ""
          );
          setExpiryDate(user.Expiration_Date ? `**/**` : "");
          setCardReferencer(user.Card_Number ? user.Card_Number.slice(-4) : "");
          setCvv(user.CVV ? "***" : "");
          if (user.Direction) {
            setAddress(user.Direction);
            setAddressFromAPI(true); // Marcar que la dirección fue obtenida de la API
          }
          setHasCreditCard(
            user.Card_Number !== null && user.Card_Number !== ""
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [userData, hasCreditCard]);

  const setSavedCreditCard = (creditCardNumber) => {
    setHasCreditCard(true);
    setCardNumber(creditCardNumber);
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (orderItems.length === 0) {
      toast.warn("No products in the order.");
      return;
    }

    const nitValue = nit.trim() === "" ? "C/F" : nit.trim();

    if (nitValue !== "C/F" && !/^\d{1,8}-?\d?$/.test(nitValue)) {
      toast.warn("Please enter a valid NIT (up to 8 digits and optional -X).");
      return;
    }

    const orderData = {
      ID_User: userData.id_user,
      NIT: nitValue,
      Card_Referencer: cardReferencer,
      Shipping_Price: shippingPrice,
      Minimum_Amount_Surcharge: surcharge,
      Total: total,
      Order_State: "Accepted",
      Order_Date: new Date().toISOString(),
      Direction_Order: address,
      details: orderItems.map((item) => ({
        ID_Product: item.id,
        Product_Amount: item.quantity,
        Unit_Price: item.price,
        Subtotal: item.price * item.quantity,
      })),
    };

    console.log("Order Data:", JSON.stringify(orderData, null, 2));

    createOrder(orderData)
      .then((response) => {
        toast.success("Order created:", response);
        navigate("/payment-success");
      })
      .catch((error) => {
        console.error("Error creating order:", error);
        toast.error(
          "There was a problem processing your order. Please try again."
        );
      });
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <div className="container mt-5 payment-page-container">
        <div className="row">
          <div className="col-md-6">
            <div
              className="card p-4"
              style={{ backgroundColor: "blueviolet", borderRadius: "10px" }}
            >
              <h2 className="text-center text-white mb-4">Payment Details</h2>
            
                {!hasCreditCard ? (
                  <div>
                    <Button variant="primary" onClick={handleShow}>
                      Add Credit Card
                    </Button>

                    <Modal show={show} onHide={handleClose}>
                      <Modal.Header
                        style={{ backgroundColor: "blueviolet" }}
                        closeButton
                      >
                        <Modal.Title>Credit Card</Modal.Title>
                      </Modal.Header>
                      <Modal.Body style={{ backgroundColor: "blueviolet" }}>
                        <CreditCardForm
                          onCreditCardSaved={setSavedCreditCard}
                        />
                      </Modal.Body>
                    </Modal>
                  </div>
                ) : (
                  <div>
                    <div className="form-group mb-3">
                      <label className="text-white">Card Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cardNumber}
                        placeholder="1234 5678 9012 3456"
                        readOnly
                      />
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
                            readOnly
                          />
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
                            readOnly
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
                        readOnly
                      />
                    </div>
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label className="text-white">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Full address"
                      readOnly={addressFromAPI} // Solo en modo solo lectura si viene de la API
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="text-white">Nit</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nit}
                      onChange={(e) => setNit(e.target.value)}
                      placeholder="Nit (e.g., 1234567-8)"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success btn-block mt-4"
                  >
                    Complete Purchase
                  </button>
                </form>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-4 order-summary-card">
              <h3 className="text-center order-summary-title">Order Summary</h3>
              <ul className="list-group mb-4 order-list">
                {orderItems.map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center order-item"
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="img-thumbnail order-item-image"
                        style={{
                          width: "50px",
                          height: "50px",
                          marginRight: "10px",
                        }}
                      />
                      <div className="order-item-info">
                        <h6>{item.title}</h6>
                        <p>
                          Q{item.price} x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div>
                      <strong>
                        ${(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="order-summary text-center">
                <h4>Subtotal: Q{subtotal.toFixed(2)}</h4>
                <p>Shipping Price: Q{shippingPrice.toFixed(2)}</p>
                {surcharge > 0 ? (
                  <p>Additional Surcharge: Q{surcharge.toFixed(2)}</p>
                ) : (
                  <p>Additional Surcharge: Q 0.00</p>
                )}
                <h4>Total: Q{total.toFixed(2)}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentPage;
