import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <>
    <button onClick={() => loginWithRedirect()} className="hidden md:flex text-sm text-black hover:cursor-pointer no-underline shadow-sm p-1.5 px-2 rounded bg-teal-300">
      Log In
    </button>
    </>
    
  );
};
export default LoginButton;
