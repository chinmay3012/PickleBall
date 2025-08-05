import { useState } from "react";
import { useCart } from "../context/CartContext"; // or useContext directly

function ProductsCard({ image, alt, title, price }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart(); // replace with your context import

  const handleAddToCart = () => {
    addToCart({ image, alt, title, price });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000); // show "Added to Cart" for 2 seconds
  };

  return (
    <div className="group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white">
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-lg text-gray-700">{price}</p>
      </div>
      <div>
        <button
          onClick={handleAddToCart}
          disabled={added}
          className={`justify-center w-full py-2 px-2 rounded-b-lg flex items-center transition-colors ${
            added ? "bg-green-500" : "bg-black hover:bg-gray-800"
          } text-white cursor-pointer`}
        >
          {added ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductsCard;
