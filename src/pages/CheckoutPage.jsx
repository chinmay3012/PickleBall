import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

/* Robust price parser: returns rupees as a Number (not paise). */
function formatINR(n) {
  const numberToFormat = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberToFormat);
}

/* Load Razorpay SDK on demand */
function loadRazorpaySDK(timeout = 10000) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("No window"));
    if (window.Razorpay) return resolve(true);

    const existing = document.getElementById("razorpay-sdk");
    if (existing) {
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

  // load address
  useEffect(() => {
    const saved = localStorage.getItem("userAddress");
    if (saved) setAddress(saved);
  }, []);

  // pre-load SDK (non-blocking)
  useEffect(() => {
    let mounted = true;
    loadRazorpaySDK()
      .then(() => mounted && setSdkReady(true))
      .catch(() => mounted && setSdkReady(false));
    return () => { mounted = false; };
  }, []);

  // single source-of-truth totals
  const itemsParsed = cartItems.map((it) => {
    const price = parsePrice(it.price ?? it.priceNumber ?? it.amount);
    const qty = Number.isFinite(it.quantity) ? it.quantity : 1;
    return { ...it, priceNum: price, qty, lineTotal: price * qty };
  });

  const totalAmount = itemsParsed.reduce((s, it) => s + it.lineTotal, 0);
  const totalItems = itemsParsed.reduce((s, it) => s + it.qty, 0);

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      alert("Please enter your address.");
      return;
    }
    if (!cartItems.length) {
      alert("Cart is empty.");
      return;
    }

    setProcessing(true);

    // debug logs — copy these if you report back
    console.log("DEBUG: cartItems raw:", cartItems);
    console.log("DEBUG: itemsParsed:", itemsParsed);
    console.log("DEBUG: totalAmount (rupees):", totalAmount);

    const amountPaise = Math.round(totalAmount * 100);
    console.log("DEBUG: amountPaise:", amountPaise);
    console.log("DEBUG: VITE_RAZORPAY_KEY_ID:", import.meta.env.VITE_RAZORPAY_KEY_ID);

    if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
      setProcessing(false);
      alert("Razorpay Key ID is missing. Add VITE_RAZORPAY_KEY_ID to .env and rebuild/deploy.");
      return;
    }

    if (amountPaise <= 0) {
      setProcessing(false);
      alert("Total amount is zero. Check item prices.");
      return;
    }

    try {
      await loadRazorpaySDK();
      setSdkReady(true);
    } catch (err) {
      setProcessing(false);
      alert("Payment SDK failed to load. Try again.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amountPaise,
      currency: "INR",
      name: "PickleBall Store",
      description: "Order Payment",
      prefill: { name: "", email: "", contact: "" },
      theme: { color: "#3399cc" },
      handler: function (response) {
        // Payment successful callback
        const orderRecord = {
          id: response?.razorpay_payment_id ?? `local_${Date.now()}`,
          paymentId: response?.razorpay_payment_id ?? null,
          items: itemsParsed,
          amount: totalAmount,
          currency: "INR",
          address,
          createdAt: new Date().toISOString(),
        };

        // save orders locally
        const key = "pb_orders_v1";
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        existing.unshift(orderRecord);
        localStorage.setItem(key, JSON.stringify(existing));

        // clear cart storage so UI can read empty cart (and your CartContext will rehydrate on load)
        localStorage.setItem("cartItems", JSON.stringify([]));

        setProcessing(false);
        navigate(`/thank-you?order=${encodeURIComponent(orderRecord.id)}`);
      },
      modal: {
        ondismiss: function () {
          // user closed modal
          setProcessing(false);
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
      // handler or ondismiss will reset processing
    } catch (err) {
      console.error("Could not open Razorpay:", err);
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
        <p className="font-medium">Total Price: {formatINR(totalAmount)}</p>
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
