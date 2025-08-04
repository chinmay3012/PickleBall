import { useState } from 'react';
import HamburgerIcon from '../assets/hamburger';

function Sidemenu(){

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        console.log("Button clicked");
        setIsMenuOpen(!isMenuOpen);
    }

    return (
    <>
        <button  onClick={toggleMenu}>
            <HamburgerIcon/>
        </button>
    </>
    )
}

export default Sidemenu;