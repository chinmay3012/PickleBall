import HeroSection from "../components/HeroSection";
import ProductsCard from "../components/ProductsCard";

function HomePage(){
        return(
     <>
        <div>                 
                    <HeroSection />

            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ProductsCard 
                        id={1}
                        image="https://placehold.co/400x533/f5f5f7/333?text=Paddle+Series+X"
                        alt="Pickleball Paddle"
                        title="Pro-Spin Paddle"
                        price="8,999"
                        />
                        <ProductsCard 
                        id={2}
                        image="https://placehold.co/400x533/f5f5f7/333?text=Court+Performance+Jersey"
                        alt="Pickleball Jersey"
                        title="Quick-Dry Jersey"
                        price="Rs. 3,500"
                        />
                        <ProductsCard 
                        id={3}
                        image="https://placehold.co/400x533/f5f5f7/333?text=Dink+Master+Hat"
                        alt="Pickleball Hat"
                        title="Performance Hat"
                        price="Rs. 1,200"
                        />
                        
                        <ProductsCard 
                        id={4}
                        image="https://placehold.co/400x533/f5f5f7/333?text=Official+Game+Balls"
                        alt="Pickleball Balls"
                        title="Official Balls (3-Pack)"
                        price="Rs. 850"
                        />
                    </div>
                    <div className="text-center mt-12">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors font-medium">DISCOVER MORE &gt;</button>
                        </div>
                        </section>
       </div>
       
 </>
        )
        }
    export default HomePage;