function ProductsCard({ image, alt, title, price }){
    return (
        <>
          {/* Products Section */}
                
                    {/* Sample Product Card 1 */}
                    <div className="group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white ">
                        <div className="relative overflow-hidden aspect-[3/4]">
                            <img src={image} alt={alt}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <div className="p-4 text-center">
                            <h3 className="font-semibold text-gray-900">{title}</h3>
                            <p className="text-lg text-gray-700">{price}</p>
                        </div>
                        <div>
                            <button className="justify-center w-full bg-black text-white py-2 px-2 rounded-b-lg hover:bg-gray-800 transition-colors items-center flex">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                
        </>
    )
}

export default ProductsCard;