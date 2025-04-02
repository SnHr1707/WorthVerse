import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Assets/logo.png';

function Login() {
    const [credentials, setCredentials] = useState({ emailorusername: "", password: "" });
    const [message, setMessage] = useState(''); // Keep message as a string or object { text, type }
    const navigate = useNavigate();

    const handleOnChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setMessage(''); // Reset message

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
                setMessage({ text: data.message || 'Login Successful!', type: 'success' }); // Use message from backend or a default
                console.log("Login Successful");

                // --- DYNAMIC REDIRECTION ---
                // Check if the username is available in the response data
                // Adjust 'data.username' or 'data.user.username' based on your actual backend response structure
                const username = data.username || (data.user && data.user.username);

                if (username) {
                    console.log(`Redirecting to profile: /profile/${username}`);
                    navigate(`/profile/${username}`); // Redirect to the user's specific profile page
                } else {
                    // Handle case where login is successful but username is missing in response
                    console.error("Login successful, but username not found in response data:", data);
                    setMessage({ text: 'Login successful, but could not retrieve user profile. Redirecting home.', type: 'warning' });
                    // Optional: Redirect to a default page like home if username is missing
                    setTimeout(() => navigate('/'), 2000); // Redirect home after a short delay
                }
                // --- END DYNAMIC REDIRECTION ---

            } else {
                // Handle login failure (e.g., wrong password, user not found)
                setMessage({ text: data.message || 'Login Failed. Please check your credentials.', type: 'error' });
                console.error("Login Failed:", data.message || 'No specific error message from server.');
            }
        } catch (error) {
            // Handle network errors or issues parsing the response
            console.error('Login error:', error);
            setMessage({ text: 'Login failed due to a network or server issue. Please try again later.', type: 'error' });
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
                <div className="text-center mb-6">
                    <Link to="/">
                        <img src={logo} alt='Logo' className="w-24 h-24 mx-auto" />
                    </Link>
                    <h2 className="text-xl font-semibold text-gray-800">WorthVerse</h2>
                    <h3 className="text-lg font-bold text-gray-800">Welcome</h3>
                </div>
                {/* Ensure message state is an object with text and type */}
                {message && message.text && (
                    <div className={`mb-3 p-2 rounded text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : message.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}
                <form onSubmit={handleLogin}>
                    {/* Removed unnecessary unique 'id' attributes, 'name' is sufficient */}
                    <input name='emailorusername' type="text" className="w-full p-2 mb-3 border rounded" placeholder="Enter Email or Username" value={credentials.emailorusername} onChange={handleOnChange} required />
                    <input name='password' type="password" className="w-full p-2 mb-3 border rounded" placeholder="Password" value={credentials.password} onChange={handleOnChange} required />
                    <div className="flex justify-between items-center text-sm mb-3">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="text-gray-800 font-semibold hover:underline">Forgot password?</Link>
                    </div>
                    <button type="submit" className="w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-700 transition-colors">Login</button>
                </form>
                <div className="text-center mt-4 text-sm">
                    <p>New Here? <Link to="/signup" className="text-gray-800 font-semibold hover:underline">Create an Account</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;