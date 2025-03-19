import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/logo.png';

function Login() {
    const [credentials, setCredentials] = useState({ emailorusername: "", password: "" });

    const handleOnChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    const handleLogin = (event) => {
        event.preventDefault();
        console.log("Form submitted", credentials);
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
                <form onSubmit={handleLogin}>
                    <input name='emailorusername' type="text" className="w-full p-2 mb-3 border rounded" placeholder="Enter Email or Username" value={credentials.emailorusername} onChange={handleOnChange} />
                    <input name='password' type="password" className="w-full p-2 mb-3 border rounded" placeholder="Password" value={credentials.password} onChange={handleOnChange} />
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
                    <p>New Here? <Link to="/signup" className="text-gray-800 font-semibold underline">Create an Account</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;