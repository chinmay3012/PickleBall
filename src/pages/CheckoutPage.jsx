// import React, { useState, useEffect } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import axios from 'axios';
// import { useCart } from '../context/CartContext';
// import { useNavigate } from 'react-router-dom';

// const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY'); // Replace with your actual publishable key

// const CheckoutForm = () => {
//   const [succeeded, setSucceeded] = useState(false);
//   const [error, setError] = useState(null);
//   const [processing, setProcessing] = useState('');
//   const [disabled, setDisabled] = useState(true);
//   const [clientSecret, setClientSecret] = useState('');
//   const stripe = useStripe();
//   const elements = useElements();
//   const { cartItems, clearCart } = useCart();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Create PaymentIntent as soon as the page loads
//     const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     if (totalAmount > 0) {
//       axios.post('/create-payment-intent', { amount: totalAmount * 100 }) // amount in cents
//         .then(res => {
//           setClientSecret(res.data.clientSecret);
//         })
//         .catch(err => {
//           console.error("Error creating payment intent:", err);
//           setError("Failed to initialize checkout. Please try again.");
//         });
//     }
//   }, [cartItems]);

//   const handleChange = async (event) => {
//     // Listen for changes in the CardElement
//     // and display any errors as the customer types their card details
//     setDisabled(event.empty);
//     setError(event.error ? event.error.message : "");
//   };

//   const handleSubmit = async (ev) => {
//     ev.preventDefault();
//     setProcessing(true);

//     if (!stripe || !elements) {
//       // Stripe.js has not yet loaded.
//       // Make sure to disable form submission until Stripe.js has loaded.
//     }
// }
// }

// export default CheckoutPage(){
//     return (
//         <div className="min-h-screen p-8">
//         <h1 className="text-4xl font-bold mb-6 text-center">Checkout</h1>
//         <Elements stripe={stripePromise}>
//             <CheckoutForm />
//         </Elements>
//         </div>
//     );
// }

// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function parsePrice(value) {
    if (typeof value === "number") return value;
  
    // Remove currency symbols and commas
    const cleaned = String(value).replace(/[^0-9.]/g, "");
    const n = parseFloat(cleaned);
  
    // If invalid, return 0
    return Number.isFinite(n) ? n : 0;
  }
  
  function formatINR(n) {
    const numberToFormat = Number.isFinite(n) ? n : 0;
  
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numberToFormat);
  }
  

function loadRazorpaySDK(timeout = 10000) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("No window"));
    if (window.Razorpay) return resolve(true);

    const existing = document.getElementById("razorpay-sdk");
    if (existing) {
      // script present but not ready yet — poll for a short time
      let waited = 0;
      const iv = setInterval(() => {
        if (window.Razorpay) {
          clearInterval(iv);
          return resolve(true);
        }
        waited += 100;
        if (waited >= timeout) {
          clearInterval(iv);
          return reject(new Error("Razorpay SDK load timeout"));
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [sdkReady, setSdkReady] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Load address once
  useEffect(() => {
    const saved = localStorage.getItem("userAddress");
    if (saved) setAddress(saved);
  }, []);

  // Attempt to pre-load SDK on mount (non-blocking)
  useEffect(() => {
    let mounted = true;
    loadRazorpaySDK()
      .then(() => {
        if (mounted) setSdkReady(true);
      })
      .catch(() => {
        if (mounted) setSdkReady(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // single total calculation used for display and payment
  const totalAmount = cartItems.reduce((sum, item) => {
    const price = parsePrice(item.price);
    const qty = Number.isFinite(item.quantity) ? item.quantity : 1;
    return sum + price * qty;
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => {
    const qty = Number.isFinite(item.quantity) ? item.quantity : 1;
    return sum + qty;
  }, 0);

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      alert("Please enter your address.");
      return;
    }
    if (cartItems.length === 0 || totalAmount <= 0) {
      alert("Cart is empty or total is zero.");
      return;
    }

    setProcessing(true);

    try {
      await loadRazorpaySDK(); // ensure SDK loaded (wait if needed)
      setSdkReady(true);
    } catch (err) {
      setProcessing(false);
      alert("Payment gateway failed to load. Check your connection.");
      return;
    }

    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!keyId) {
      setProcessing(false);
      alert("Razorpay Key ID is missing. Add VITE_RAZORPAY_KEY_ID to .env and restart.");
      return;
    }

    // Fix: Use Math.round() to ensure a whole number of paise
    const amountPaise = Math.round(totalAmount * 100);
    const orderIdFallback = `${Date.now()}`;

    const options = {
      key: keyId,
      amount: amountPaise,
      currency: "INR",
      name: "PickleBall Store",
      description: "Order Payment",
      order_id: undefined, // optional when no backend order creation
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: { color: "#3399cc" },
      handler: function (response) {
        // successful payment callback
        try {
          // build local order record
          const orderRecord = {
            id: response?.razorpay_payment_id ? response.razorpay_payment_id : orderIdFallback,
            paymentId: response?.razorpay_payment_id || null,
            items: cartItems,
            amount: totalAmount,
            currency: "INR",
            address,
            createdAt: new Date().toISOString(),
            verified: false, // cannot verify without backend
          };

          // save to localStorage orders list
          const key = "pb_orders_v1";
          const existing = JSON.parse(localStorage.getItem(key) || "[]");
          existing.unshift(orderRecord);
          localStorage.setItem(key, JSON.stringify(existing));

          // clear local cart (context is not exposed to mutate directly here)
          localStorage.setItem("cartItems", JSON.stringify([]));

          // navigate to thank-you page with order id
          navigate(`/thank-you?order=${encodeURIComponent(orderRecord.id)}`);
        } finally {
          setProcessing(false);
        }
      },
      modal: {
        ondismiss: function () {
          // user closed the payment modal without paying
          setProcessing(false);
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
      // do not setProcessing(false) here. it will be handled in handler or ondismiss.
    } catch (err) {
      setProcessing(false);
      alert("Could not open payment window. Try again.");
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      <div className="mb-6">
        <label className="block font-medium mb-2">Shipping Address</label>
        <textarea
          className="w-full p-3 border rounded"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your shipping address"
        />
      </div>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <p>Total Items: {totalItems}</p>
        <p className="font-medium">
          Total Price: {formatINR(totalAmount *100 )}
        </p>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={processing || !sdkReady || cartItems.length === 0}
        className={`mt-6 w-full text-white py-2 rounded ${
          processing || !sdkReady || cartItems.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {processing ? "Processing..." : sdkReady ? "Place Order" : "Loading Payment..."}
      </button>
    </div>
  );
}
