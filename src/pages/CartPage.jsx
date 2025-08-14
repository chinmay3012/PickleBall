import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import React from "react";


function CartPage() {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-lg">Your cart is empty.</p>
      ) : (
        <div className="grid gap-4 max-w-xl mx-auto">
          {cartItems.map((item, index) => (
            <div key={item.id || index} className="flex items-center gap-4 border p-4 rounded shadow">
              <img src={item.image} alt={item.alt} className="w-20 h-20 object-cover rounded" />
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p>{item.price}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p> 
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="px-2 py-1 bg-black text-white rounded hover:bg-red-600 text-sm mt-1">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="max-w-xl mx-auto mt-8 p-4 border rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">Cart Summary</h2>
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Total:</span>
            <span className="font-medium">
              Rs. {cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace('Rs. ', '').replace(',', '')) * item.quantity, 0).toFixed(2)}
            </span>
          </div>
          <div>
          <button className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        </div>
        </div>
      )}

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="mt-4 p-2.5 bg-blue-500 text-white rounded hover:bg-blue-600">
            Continue Shopping
          </button>
        </div>
    </div>
  );
}

export default CartPage;
