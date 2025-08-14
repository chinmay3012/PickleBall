import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";


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
                <h3 className="font-semibold">{item.title}</h3>
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

      <div className="text-center mt-10">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => navigate("/home")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default CartPage;
