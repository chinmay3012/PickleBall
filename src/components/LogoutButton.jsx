import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() => logout({ returnTo: window.location.origin })}
      className="text-sm text-black hover:cursor-pointer no-underline shadow-sm p-1.5 rounded bg-teal-300" 
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
