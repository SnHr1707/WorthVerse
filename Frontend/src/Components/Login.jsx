// --- START OF REGENERATED FILE Login.jsx ---
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Assets/logo.png'; // Assuming you have the logo image

function Login() {
    const [credentials, setCredentials] = useState({ emailorusername: "", password: "" });
    const [message, setMessage] = useState({ text: '', type: '' }); // Initialize message state properly
    const [loading, setLoading] = useState(false); // For login submission
    const [checkingAuth, setCheckingAuth] = useState(true); // State to track initial auth check
    const navigate = useNavigate();

    // 1. Check authentication status on component mount
    useEffect(() => {
        const checkAuthentication = async () => {
            console.log("Checking authentication status...");
            try {
                // Use the /check-auth endpoint which is protected and returns user info if valid token exists
                const response = await fetch('http://localhost:5000/api/auth/check-auth', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Send cookies
                });

                if (response.ok) {
                    const data = await response.json();
                    // If authenticated, redirect to the user's profile page
                    if (data.isAuthenticated && data.user?.username) {
                        console.log(`Already logged in as ${data.user.username}. Redirecting...`);
                        navigate(`/profile/${data.user.username}`, { replace: true }); // Use replace to avoid login page in history
                    } else {
                        // Valid response but not authenticated (shouldn't happen with 200 OK, but safety check)
                        console.log("Check auth response OK, but not authenticated.");
                        setCheckingAuth(false); // Allow login form to show
                    }
                } else if (response.status === 401) {
                    // Not authenticated (expected case for login page)
                    console.log("Not currently authenticated.");
                    setCheckingAuth(false); // Allow login form to show
                } else {
                     // Handle other potential errors during check
                     console.error("Error checking authentication:", response.statusText);
                     setMessage({ text: 'Could not verify login status. Please try logging in.', type: 'error' });
                     setCheckingAuth(false); // Allow login form to show
                }

            } catch (error) {
                console.error('Error during authentication check:', error);
                setMessage({ text: 'Network error checking login status.', type: 'error' });
                setCheckingAuth(false); // Allow login form to show
            }
        };

        checkAuthentication();
    }, [navigate]); // Dependency array includes navigate

    // Handle input changes
    const handleOnChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    // Handle login form submission
    const handleLogin = async (event) => {
        event.preventDefault();
        setMessage({ text: '', type: '' }); // Clear previous messages
        setLoading(true); // Set loading state

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: 'include', // Important: Include cookies in the request
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ text: data.message || 'Login successful!', type: 'success' }); // Use message from API or default
                console.log("Login Successful. User:", data.user);

                // 2. Redirect to the specific user's profile page on successful login
                if (data.user && data.user.username) {
                     navigate(`/profile/${data.user.username}`);
                 } else {
                     // Fallback if username is somehow missing in response (shouldn't happen)
                     console.warn("Username missing in login response, redirecting to generic profile.");
                     navigate('/profile'); // Or maybe home '/'
                 }

            } else {
                setMessage({ text: data.message || 'Login failed. Invalid credentials.', type: 'error' });
                console.error("Login Failed:", data.message);
            }
        } catch (error) {
            console.error('Login submission error:', error);
            setMessage({ text: 'Login failed due to a network or server issue. Please try again later.', type: 'error' });
        } finally {
             setLoading(false); // Reset loading state
        }
    };

    // Display loading indicator while checking auth status
    if (checkingAuth) {
        return (
             <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="text-center">
                     <i className="fas fa-spinner fa-spin text-gray-500 text-3xl"></i>
                     <p className="mt-2 text-gray-600">Checking login status...</p>
                </div>
             </div>
        );
    }

    // Render login form if not checking auth and not redirected
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-100 flex justify-center items-center p-4">
            <div className="bg-white p-8 shadow-xl rounded-lg max-w-md w-full border border-gray-200">
                <div className="text-center mb-6">
                    <Link to="/" className="inline-block mb-3">
                        <img src={logo} alt='WorthVerse Logo' className="w-20 h-20 mx-auto transition-transform duration-300 hover:scale-110" />
                    </Link>
                    <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Welcome Back!</h2>
                    <p className="text-sm text-gray-500 mt-1">Log in to your WorthVerse account</p>
                </div>

                {/* Message Display */}
                {message.text && (
                    <div className={`mb-4 p-3 rounded-md text-sm ${
                        message.type === 'success'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email or Username Input */}
                    <div>
                         <label htmlFor="emailorusername" className="block text-sm font-medium text-gray-700 mb-1">
                            Email or Username
                         </label>
                         <input
                            id="emailorusername"
                            name="emailorusername"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            placeholder="Enter Email or Username"
                            value={credentials.emailorusername}
                            onChange={handleOnChange}
                            required
                            aria-label="Email or Username"
                         />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                         </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            placeholder="Enter your password"
                            value={credentials.password}
                            onChange={handleOnChange}
                            required
                            aria-label="Password"
                        />
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center text-gray-600 cursor-pointer">
                            <input type="checkbox" className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center items-center bg-indigo-600 text-white p-2.5 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                         {loading ? (
                             <>
                                <i className="fas fa-spinner fa-spin mr-2"></i>
                                Logging in...
                             </>
                         ) : (
                            'Log In'
                         )}
                    </button>
                </form>

                {/* Sign Up Link */}
                <div className="text-center mt-6 text-sm text-gray-600">
                    <p>New Here?{' '}
                        <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
                             Create an Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;