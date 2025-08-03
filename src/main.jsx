
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById('root')).render(
    <Auth0Provider
    domain="dev-21krctk1ttmmqn3x.us.auth0.com"
    clientId="n6A201MXrx0Bweh28gaX9ZB6WztE9z5O"
    authorizationParams={{
      redirect_uri: window.location.origin
    }} >
    <App />

    </Auth0Provider>
);
