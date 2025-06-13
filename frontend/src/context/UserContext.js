import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(() => localStorage.getItem('token'));
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Sync state when the token in localStorage changes in another tab
        const syncToken = (event) => {
            if (event.key === 'token') {
                setUserToken(event.newValue);
            }
        };

        window.addEventListener('storage', syncToken);

        return () => {
            window.removeEventListener('storage', syncToken);
        };
    }, []);

    const clearToken = () => {
        localStorage.removeItem('token');
        setUserToken(null);
    };

    return (
        <UserContext.Provider value={{ userToken, setUserToken,currentUser, setCurrentUser, clearToken }}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
