import React, { useState, useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation

const PrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Use null for initial loading state
    const navigate = useNavigate();
    const location = useLocation(); // Get current location

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/auth/check-auth', { // Backend auth check endpoint
                    method: 'GET', // Or POST, depending on your preference
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Important: Include cookies in the request
                });

                if (response.ok) {
                    setIsAuthenticated(true); // User is authenticated
                } else {
                    setIsAuthenticated(false); // User is not authenticated
                }
            } catch (error) {
                console.error('Authentication check error:', error);
                setIsAuthenticated(false); // Assume not authenticated in case of error
            }
        };

        checkAuthentication();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Or a spinner component
    }

    return isAuthenticated ? (
        children // Render the protected component if authenticated
    ) : (
        <Navigate to="/login" replace state={{ from: location }} /> // Redirect to login if not, сохраняя текущий путь
    );
};

export default PrivateRoute;