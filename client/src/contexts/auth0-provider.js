import React, {useContext} from 'react'
import { useHistory } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import config from '../config'
import { routeContext } from './useReroute';

const AuthProvider = ({children}) => {
    const history = useHistory()
    const {currentLocation} = useContext(routeContext)
    const domain = config.AUTHO_DOMAIN;
    const clientId = config.AUTHO_CLIENT_ID;
    const onRedirectCallback = (appState) => {
        history.push(appState?.returnTo || window.location.pathname)
    }
    return (
        <Auth0Provider
        domain={domain}
        clientId={clientId}
        redirectUri={window.location.origin}
        onRedirectCallback={onRedirectCallback}>
            {children}
        </Auth0Provider>
    )
}

export default AuthProvider;
