import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddressForm from "./AddressForm";
import { useNavigate } from "react-router-dom";
import "./checkout.css";
import { fetchAddress } from "../features/checkout/checkoutSlice";
import { addToOrder } from "../features/order/orderSlice";
import Footer from "./Footer";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "./StripePaymentForm";
import api from "../api/axios";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51PlaceholderPublishableKeyForTesting"
);

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' or 'card'
  const [isSubmittingCod, setIsSubmittingCod] = useState(false);

  const { selectedItems } = useSelector((state) => state.cartItems);
  const { address } = useSelector((state) => state.address);

  useEffect(() => {
    dispatch(fetchAddress());
  }, [dispatch]);

  const subPrice = selectedItems.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);

  const totalQty = selectedItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
  const shipPrice = 150;
  const totalPrice = subPrice + shipPrice;

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const orderData = {
        address: address && address.length > 0 ? address[0].id : null,
        items: selectedItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      };

      const resultAction = await dispatch(addToOrder(orderData)).unwrap();

      if (resultAction && resultAction.id) {
        await api.post("confirm-stripe-payment/", {
          order_id: resultAction.id,
          payment_intent_id: paymentIntent.id,
        });
      }

      navigate("/my-orders");
    } catch (err) {
      console.error("Order processing after payment failed:", err);
      navigate("/cartitems");
    }
  };

  const handleCodOrder = async () => {
    if (!address || address.length === 0) {
      alert("Please add a shipping address before completing your order.");
      return;
    }

    setIsSubmittingCod(true);
    try {
      const orderData = {
        address: address[0].id,
        items: selectedItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      };

      await dispatch(addToOrder(orderData)).unwrap();
      navigate("/Myorders");
    } catch (err) {
      console.error("COD order failed:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmittingCod(false);
    }
  };

  return (
    <>
      <div className="checkout-container mt-5">
        {/* LEFT SIDE */}
        <div className="checkout-left">
          <div className="box">
            <h5 className="mb-3">Shipping Address</h5>
            {address && address.length > 0 ? (
              address.map((add) => (
                <div key={add.id}>
                  <p>
                    {add.full_name} <span>{add.phone_number}</span>
                  </p>
                  <p>{add.address_line}</p>
                </div>
              ))
            ) : (
              <AddressForm />
            )}
          </div>

          <div className="box">
            <h5 className="mb-3">Selected Items</h5>
            {selectedItems.map((item, id) => (
              <div key={item.id}>
                <div className="cartitems">
                  <div className="cartitemsdetail">
                    <img
                      src={item.image || "/placeholder.png"}
                      className="cartitemsimage"
                      alt={item.productname || "Product"}
                    />

                    <div className="cartname">
                      <h6>{item.productname}</h6>
                      <p>Qty: {item.quantity}</p>
                    </div>

                    <div>
                      <p>Rs {item.price}</p>
                    </div>
                  </div>
                </div>
                {id !== selectedItems.length - 1 && <hr />}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="checkout-right">
          <div className="chech-head">
            <h3>Order Summary</h3>
          </div>

          <div className="p-3">
            <div className="summary-row">
              <p>Subtotal ({totalQty})</p>
              <span>Rs {subPrice}</span>
            </div>

            <div className="summary-row">
              <p>Shipping</p>
              <span>Rs {shipPrice}</span>
            </div>

            <div className="summary-row total">
              <p>Total</p>
              <span>Rs {totalPrice}</span>
            </div>

            {/* Payment Method Selector */}
            <div className="payment-options mt-4 mb-3">
              <h6 className="fw-bold mb-3">Select Payment Method:</h6>

              <div className="form-check mb-2 p-2 border rounded" style={{ cursor: "pointer" }}>
                <input
                  className="form-check-input ms-1"
                  type="radio"
                  name="paymentMethod"
                  id="cod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <label className="form-check-label ms-2 fw-semibold" htmlFor="cod" style={{ cursor: "pointer" }}>
                  💵 Cash on Delivery (COD)
                </label>
              </div>

              <div className="form-check mb-3 p-2 border rounded" style={{ cursor: "pointer" }}>
                <input
                  className="form-check-input ms-1"
                  type="radio"
                  name="paymentMethod"
                  id="card"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <label className="form-check-label ms-2 fw-semibold" htmlFor="card" style={{ cursor: "pointer" }}>
                  💳 Pay Online with Card (Stripe)
                </label>
              </div>
            </div>

            {/* Payment Form / Action Button */}
            {paymentMethod === "cod" ? (
              <button
                onClick={handleCodOrder}
                className="checkout-btn mt-2"
                disabled={!address || address.length === 0 || selectedItems.length === 0 || isSubmittingCod}
              >
                {isSubmittingCod ? "Placing Order..." : "Place Order (Cash on Delivery)"}
              </button>
            ) : (
              <Elements stripe={stripePromise}>
                <StripePaymentForm
                  totalAmount={totalPrice}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default Checkout;


