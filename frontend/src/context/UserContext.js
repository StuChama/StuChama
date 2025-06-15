import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(() => localStorage.getItem('token'));
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // Sync token across browser tabs
    useEffect(() => {
        const syncToken = (event) => {
            if (event.key === 'token') {
                setUserToken(event.newValue);
            }
        };
        window.addEventListener('storage', syncToken);
        return () => window.removeEventListener('storage', syncToken);
    }, []);

    // Fetch current user from /me route
    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (!userToken) {
                setCurrentUser(null);
                setLoadingUser(false);
                return;
            }

            const endpoint = `${process.env.REACT_APP_BACKEND_URL}/api/auth/me`;

            try {
                const res = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });

                const userData = res.data?.user || res.data;
                setCurrentUser(userData);

            } catch (err) {
                clearToken(); // Remove invalid token
            } finally {
                setLoadingUser(false);
            }
        };

        fetchCurrentUser();
    }, [userToken]);

    // Store token if changed
    useEffect(() => {
        if (userToken) {
            localStorage.setItem('token', userToken);
        }
    }, [userToken]);

    const clearToken = () => {
        localStorage.removeItem('token');
        setUserToken(null);
        setCurrentUser(null);
    };

    return (
        <UserContext.Provider
            value={{
                userToken,
                setUserToken,
                currentUser,
                setCurrentUser,
                clearToken,
                loadingUser
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
