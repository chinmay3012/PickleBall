import { useState , useEffect , useRef } from "react";
import Marquee from "react-fast-marquee";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import Sidemenu from "./Sidemenu";
import LoginMobile from "./LoginMobile";
import LogoutMobile from "./LogoutMobile";
import CartPage from "../pages/CartPage";

function Navbar(){

    const [searchQuery, setSearchQuery] = useState(false);
    const [isTopGearOpen, setIsTopGearOpen] = useState(false);
    const [isApparelOpen, setIsApparelOpen] = useState(false);
    const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);

    const { isAuthenticated, user, isLoading } = useAuth0();
    const navigate = useNavigate();

    // Refs for each dropdown to check for outside clicks
  const topGearRef = useRef(null);
  const apparelRef = useRef(null);
  const accessoriesRef = useRef(null);

  useEffect(()=>{
    const handleClicksOutside = (event)=> {
        if(
            topGearRef.current && !topGearRef.current.contains(event.target) &&
            apparelRef.current && !apparelRef.current.contains(event.target) &&
            accessoriesRef.current && !accessoriesRef.current.contains(event.target)
        ){
            setIsTopGearOpen(false);
            setIsApparelOpen(false);
            setIsAccessoriesOpen(false);
        }
    }
    // Add event listener for clicks outside the dropdowns
    window.addEventListener("click" , handleClicksOutside);

    // Cleanup function to remove the event listener
    return () => {
        window.removeEventListener("click", handleClicksOutside);
    }
  } , [])

    // Function to toggle dropdowns
  const toggleDropdown = (dropdownName) => {
    if (dropdownName === 'topGear') {
      setIsTopGearOpen(!isTopGearOpen);
      setIsApparelOpen(false);
      setIsAccessoriesOpen(false);
    } else if (dropdownName === 'apparel') {
      setIsApparelOpen(!isApparelOpen);
      setIsTopGearOpen(false);
      setIsAccessoriesOpen(false);
    } else if (dropdownName === 'accessories') {
      setIsAccessoriesOpen(!isAccessoriesOpen);
      setIsTopGearOpen(false);
      setIsApparelOpen(false);
      setIsTopGearOpen(false);
    }
  };

    return(
        <>
        <style>
        {`
          /* Custom keyframes for the slow spin animation */
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          /* Custom class to apply the animation */
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
          
          /* Custom transition for search bar */
          .search-bar-enter {
            opacity: 0;
            transform: translateY(-20px);
          }
          .search-bar-enter-active {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 300ms, transform 300ms;
          }
          .search-bar-exit {
            opacity: 1;
            transform: translateY(0);
          }
          .search-bar-exit-active {
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 300ms, transform 300ms;
          }
        `}
      </style>
        <nav className="mt-6 flex sticky items-center justify-between px-4 mb-1 top-0 z-20 bg-white">
        {isLoading ? (
                      <p>Loading...</p>
                    ) : isAuthenticated ? (
                      <div className="flex items-center md:gap-4 gap-2">
                        <LogoutMobile />
                      </div>
                    ) : (
                      <LoginMobile />
                    )}
            <div className="ml-2">
                <a href="/" className="text-xl font-bold text-bl transition-colors duration-300 ease-in-out 
                hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-red-500 hover:to-green-500 font-serif">PICKLESHOP</a>
            </div>
            <div className="relative hidden md:flex text-sm" ref={topGearRef}>
            <button 
              className="flex items-center gap-1 focus:outline-none hover:text-green-600 transition-colors"
              onClick={() => toggleDropdown('topGear')}
            >
              TOP GEAR 
              <svg className={`w-3 h-3 transition-transform duration-300 ${isTopGearOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isTopGearOpen && (
              <div className="absolute top-full mt-2 bg-white shadow-lg rounded-md border border-gray-100 z-10 w-48">
                <ul className="py-2 text-gray-800">
                  <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Paddles</a></li>
                  <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Balls</a></li>
                  <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Nets</a></li>
                </ul>
              </div>
            )}
          </div>
          {/* Apparel Dropdown */}
          <div className="relative hidden md:flex text-sm" ref={apparelRef}>
            <button 
              className="flex items-center gap-1 focus:outline-none hover:text-green-600 transition-colors"
              onClick={() => toggleDropdown('apparel')}
            >
              APPAREL
              <svg className={`w-3 h-3 transition-transform duration-300 ${isApparelOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isApparelOpen && (
              <div className="absolute top-full mt-2 bg-white shadow-lg rounded-md border border-gray-100 z-10 w-48">
                <ul className="py-2 text-gray-800">
                  <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Jerseys</a></li>
                  <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">T-Shirts</a></li>
                  <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Hoodies & Sweatshirts</a></li>
                  <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Shorts & Skirts</a></li>
                </ul>
              </div>
            )}
          </div>
          {/* Accessories Dropdown */}
          <div className="relative hidden md:flex text-sm" ref={accessoriesRef}>
            <button 
              className="flex items-center gap-1 focus:outline-none hover:text-green-600 transition-colors"
              onClick={() => toggleDropdown('accessories')}
            >
              ACCESSORIES
              <svg className={`w-3 h-3 transition-transform duration-300 ${isAccessoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isAccessoriesOpen && (
              <div className="absolute top-full mt-2 bg-white shadow-lg rounded-md border border-gray-100 z-10 w-48">
                <ul className="py-2 text-gray-800">
                  <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Bags</a></li>
                  <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Hats & Visors</a></li>
                  <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Grips</a></li>
                </ul>
              </div>
            )}
          </div>
            {/* Search Icon */}
            <div className="flex items-center space-x-1">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer" onClick={()=>setSearchQuery(!searchQuery)}>
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Auth0 Login/Logout Button */}
          
          {/* <button className="p-2 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A5 5 0 017 15h10a5 5 0 011.879 2.804M15 11a3 3 0 10-6 0" />
            </svg>
          </button> */}

              {isLoading ? (
                      <p>Loading...</p>
                    ) : isAuthenticated ? (
                      <div className="flex items-center md:gap-4 gap-2">
                        <img src={user.picture} alt={user.name} className=" hidden md:flex w-8 h-8 rounded-full" />
                        <LogoutButton />
                      </div>
                    ) : (
                      <LoginButton />
                    )}


          
          {isAuthenticated && (
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer" onClick={()=>navigate("/cart")}>
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4zM6 10v10h12V10H6zm6-6a2 2 0 0 0-2 2v2h4V6a2 2 0 0 0-2-2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
            </div>


          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden pt-1.5">
            <Sidemenu />
          </div>
        </nav>

        {/*Search Bar*/} 
        {searchQuery &&(
            <div className="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-center 
            transition-all duration-300 ease-in-out search-bar-enter-active sticky top-16 z-10">
            <input type="text" placeholder="Search for paddles, apparel, accessories..."
              className="flex-grow max-w-xl p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
              <button 
            className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
            onClick={() => setSearchQuery(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          </div>  
        )}
        
        <hr style={{color : "lightgray"}} className="mt-5"></hr>

        <div className="bg-black text-white items-center font-normal flex p-1 mt-1">
        <Marquee className="space-x-2.5" ><span className="text-xs uppercase tracking-wider text-gray-200">NEW DROP - NOW LIVE !!</span></Marquee>
        <Marquee className="space-x-2.5" ><span className="text-xs uppercase tracking-wider text-gray-200">NEW DROP - NOW LIVE !!</span></Marquee>
        <Marquee className="space-x-2.5" ><span className="text-xs uppercase tracking-wider text-gray-200">NEW DROP - NOW LIVE !!</span></Marquee>
        </div>
        </>
    )
}

export default Navbar;