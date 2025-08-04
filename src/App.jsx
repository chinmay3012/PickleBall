import React from "react";
import { BrowserRouter , Routes , Route , useNavigate , Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ContactPage from "./pages/Contact.jsx";

function App(){
    return(

      <>
      <div className="font-sans min-h-screen font-['system-ui', 'apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="https://picklewear.netlify.app/home" element={<HomePage/>} />
          <Route path="https://picklewear.netlify.app/about" element={<AboutPage/>} />
          <Route path="https://picklewear.netlify.app/products" element={<ProductPage/>} />
          <Route path="https://picklewear.netlify.app/contact" element={<ContactPage/>} />
          <Route path="*" element={<ErrorPage/>}/>
        </Routes>
        <Outlet />
      </BrowserRouter>
      <Footer />
      </div>
      </>
    )
}

function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">The page you are looking for does not exist.</p>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Home
      </button>
    </div>
  );
}

export default App;