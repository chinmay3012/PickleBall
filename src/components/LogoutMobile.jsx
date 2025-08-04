import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutMobile = () => {
  const { logout } = useAuth0();
  return (
    <>
    <button 
    onClick={() => logout({ returnTo: window.location.origin })} className="md:hidden text-sm text-black hover:cursor-pointer no-underline shadow-xl p-1.5 rounded font-semibold">
      Log Out
    </button>
    </>
    
  );
};
export default LogoutMobile;