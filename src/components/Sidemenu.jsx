import { useState } from 'react';
import HamburgerIcon from '../assets/hamburger';
import CloseButton from '../assets/cross';

function Sidemenu(){

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        console.log("Button clicked");
        setIsMenuOpen(!isMenuOpen);
    }

    function Menu(){
        return (
            <>
                <button onClick={toggleMenu}>
                    <HamburgerIcon/>
                </button>
                {isMenuOpen && (
                    <div className={`fixed top-0 right-0 w-[55%] transition-transform duration-500 h-full z-50 ease-in-out bg-white
                    rounded-lg ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    >
                        <button onClick={toggleMenu} className="absolute top-10 right-7">
                            <CloseButton/></button>
                        <div className="flex flex-col items-start p-4 space-y-5 mt-20 ">
                            <a href="/home" className="text-gray-800 hover:text-blue-600">Home</a>
                            <a href="/about" className="text-gray-800 hover:text-blue-600">About</a>
                            <a href="/products" className="text-gray-800 hover:text-blue-600">Products</a>
                            <a href="/contact" className="text-gray-800 hover:text-blue-600">Contact</a>
                        </div>
                    </div>
                )}
            </>
        ) 
    }

    return (
    <>
        <Menu/>
    </>
    )
}

export default Sidemenu;