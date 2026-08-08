import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../api/axios";
import "./checkout.css";

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      "::placeholder": {
        color: "#aab7c4",
      },
      padding: "10px 12px",
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

function StripePaymentForm({ totalAmount, onPaymentSuccess, orderData }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // 1. Create PaymentIntent on backend
      const response = await api.post("create-payment-intent/", {
        amount: totalAmount,
      });

      const { clientSecret } = response.data;

      // 2. Confirm card payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        // 3. Payment succeeded
        if (onPaymentSuccess) {
          await onPaymentSuccess(result.paymentIntent);
        }
        setProcessing(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.response?.data?.error || err.message || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form mt-3">
      <h5 className="mb-3">Card Payment Details</h5>
      <div className="card-element-container mb-3" style={{ border: "1px solid #ced4da", borderRadius: "6px", padding: "12px", background: "#fff" }}>
        <CardElement options={cardElementOptions} />
      </div>

      {error && <div className="alert alert-danger py-2 px-3 mb-3">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="checkout-btn w-100"
        style={{ opacity: processing ? 0.7 : 1 }}
      >
        {processing ? "Processing Payment..." : `Pay Rs ${totalAmount}`}
      </button>
    </form>
  );
}

export default StripePaymentForm;
