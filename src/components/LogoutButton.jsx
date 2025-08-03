import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() => logout({ returnTo: window.location.origin })}
      className="text-sm text-red-600 underline hover:cursor-pointer" 
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
