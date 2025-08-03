function ProductsCard({ image, alt, title, price }){
    return (
        <>
          {/* Products Section */}
                
                    {/* Sample Product Card 1 */}
                    <div className="group rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white">
                        <div className="relative overflow-hidden aspect-[3/4]">
                            <img src={image} alt={alt}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <div className="p-4 text-center">
                            <h3 className="font-normal text-gray-900">{title}</h3>
                            <p className="text-sm text-gray-600">{price}</p>
                        </div>
                    </div>
                
        </>
    )
}

export default ProductsCard;