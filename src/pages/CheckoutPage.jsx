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

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function CheckoutPage() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [paymentMode, setPaymentMode] = useState("Pay Online");

  // State to track Razorpay script loading
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // Load saved address from localStorage and Razorpay script
  useEffect(() => {
    const savedAddress = localStorage.getItem("userAddress");
    if (savedAddress) {
      setAddress(savedAddress);
    }
  }, []);

  // Effect to load the Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      setIsRazorpayLoaded(true);
    };
    script.onerror = () => {
      console.error("Razorpay SDK failed to load.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      alert("Please enter your address.");
      return;
    }

    // Check if the Razorpay script has loaded
    if (!isRazorpayLoaded) {
      alert("Payment gateway is not ready. Please try again in a moment.");
      return;
    }

    localStorage.setItem("userAddress", address);

    const totalAmount = cartItems.reduce(
      (sum, item) =>
        sum +
        parseFloat(item.price.replace("Rs. ", "").replace(",", "")) *
        item.quantity,
      0
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay Key ID from .env
      amount: Math.round(totalAmount * 100), // convert to paisa and ensure it's an integer
      currency: "INR",
      name: "PickleBall Store",
      description: "Order Payment",
      handler: function (response) {
        // This callback is called only on successful payment
        alert(
          "Order placed successfully! Payment ID: " +
            response.razorpay_payment_id
        );
        navigate("/");
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {/* Address */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Shipping Address</label>
        <textarea
          className="w-full p-3 border rounded"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your shipping address"
        />
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Payment Method</label>
        <div className="space-y-2">
          {["Pay Online"].map((method) => (
            <label key={method} className="flex items-center space-x-2">
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMode === method}
                onChange={(e) => setPaymentMode(e.target.value)}
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <p>
          Total Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        </p>
        <p className="font-medium">
          Total Price: Rs.{" "}
          {cartItems
            .reduce(
              (sum, item) =>
                sum +
                parseFloat(item.price.replace("Rs. ", "").replace(",", "")) *
                  item.quantity,
              0
            )
            .toFixed(2)}
        </p>
      </div>

      {/* Place Order */}
      <button
        onClick={handlePlaceOrder}
        className="mt-6 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        Place Order
      </button>
    </div>
  );
}

export default CheckoutPage;