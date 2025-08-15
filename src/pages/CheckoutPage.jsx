import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function CheckoutPage() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => {
      const cleaned = String(item.price).replace(/[^0-9]/g, "");
      const price = Number(cleaned) || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  const loadRazorpay = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    const totalAmount = getCartTotal();

    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
console.log(keyId); // should print your test key

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID , // Your Razorpay key ID
      amount: totalAmount * 100, // convert to paisa
      currency: "INR",
      name: "PickleBall Store",
      description: "Order Payment",
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
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

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
    }
  }, [cartItems, navigate]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Checkout</h1>
      <div className="max-w-xl mx-auto border p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between py-2 border-b">
          <span>Total:</span>
          <span>Rs. {getCartTotal().toLocaleString("en-IN")}</span>
        </div>
        <button
          onClick={handlePayment}
          className="mt-6 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
