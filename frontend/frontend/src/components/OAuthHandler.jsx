import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OAuthHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        const username = searchParams.get('username');
        
        // --- STEP 1: Check if parameters are found ---
        // console.log("OAuthHandler running...");
        // console.log("Found Token:", !!token); // Should be true
        // console.log("Found Username:", username); 

        if (token) {
            // Store the token
            localStorage.setItem('token', token);
            
            // --- STEP 2: Check if local storage worked ---
            // console.log("Token stored in localStorage:", localStorage.getItem('token')); 

            // Clean up the URL (replace history state)
            if (username) {
                // IMPORTANT: The path must only contain the route parameter, not query strings
                navigate(`/${username}`); 
            } else {
                navigate('/');
            }
        }
    }, [location, navigate]);

    return null;
};
export default OAuthHandler;