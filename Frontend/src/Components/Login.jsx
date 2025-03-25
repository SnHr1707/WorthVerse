import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Assets/logo.png';

function Login() {
    const [credentials, setCredentials] = useState({ emailorusername: "", password: "" });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleOnChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ text: data.message, type: 'success' });
                console.log("Login Successful");

                // Store username in localStorage
                localStorage.setItem('loggedInUsername', data.username); // <--- Store username

                // Redirect to MyProfile page
                navigate('/profile'); // Redirect to the MyProfile page
            } else {
                setMessage({ text: data.message, type: 'error' });
                console.error("Login Failed:", data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage({ text: 'Login failed. Please try again later.', type: 'error' });
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
                {message && (
                    <div className={`mb-3 p-2 rounded ${message.type === 'success' ? 'bg-green-200 text-green-800 text-center' : 'bg-red-200 text-red-800 text-center'}`}>
                        {message.text}
                    </div>
                )}
                <form onSubmit={handleLogin}>
                    <input name='emailorusername' type="text" className="w-full p-2 mb-3 border rounded" placeholder="Enter Email or Username" value={credentials.emailorusername} onChange={handleOnChange} required />
                    <input name='password' type="password" className="w-full p-2 mb-3 border rounded" placeholder="Password" value={credentials.password} onChange={handleOnChange} required />
                    <div className="flex justify-between items-center text-sm mb-3">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="text-gray-800 font-semibold">Forgot password?</Link>
                    </div>
                    <button type="submit" className="w-full bg-gray-800 text-white p-2 rounded">Login</button>
                </form>
                <div className="text-center mt-4 text-sm">
                    <p>New Here? <Link to="/signup" className="text-gray-800 font-semibold hover:underline">Create an Account</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;