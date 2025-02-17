import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/logo.png'

function Signup() {
    const [credentials, setCredentials] = useState({ fullname: "", email: "", username: "", password: "", confirmpassword: "" });

    const handleOnChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSendCode = () => {
        console.log("send code pls");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
                    <h3 className="text-lg font-bold text-gray-800">Create Account</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <input name='fullname' type="text" className="w-full p-2 mb-3 border rounded" placeholder="Full Name" value={credentials.fullname} onChange={handleOnChange} />
                    <input name='username' type="text" className="w-full p-2 mb-3 border rounded" placeholder="Username" value={credentials.username} onChange={handleOnChange} />
                    <div className="flex gap-2 mb-3">
                        <input type="email" name='email' className="w-full p-2 border rounded" placeholder="Email Address" value={credentials.email} onChange={handleOnChange} />
                        <button type="button" className="bg-gray-800 text-white px-4 py-2 rounded text-sm" onClick={handleSendCode}>Send Code</button>
                    </div>
                    <input type="password" name='password' className="w-full p-2 mb-3 border rounded" placeholder="Password" value={credentials.password} onChange={handleOnChange} />
                    <input type="password" name='confirmpassword' className="w-full p-2 mb-3 border rounded" placeholder="Confirm Password" value={credentials.confirmpassword} onChange={handleOnChange} />
                    <button type="submit" className="w-full bg-gray-800 text-white p-2 rounded">Sign up</button>
                </form>
                <div className="text-center mt-4 text-sm">
                    <p>Already have an account? <Link to="/login" className="text-gray-800 font-semibold">Login</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;