import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginMobile = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <>
    <button onClick={() => loginWithRedirect()} className="md:hidden text-sm text-black hover:cursor-pointer no-underline shadow-xl p-1.5 rounded font-semibold">
      Log In
    </button>
    </>
    
  );
};
export default LoginMobile;
