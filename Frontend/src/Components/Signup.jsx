// --- START OF REGENERATED FILE Signup.jsx ---
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Assets/logo.png'; // Assuming you have the logo image

function Signup() {
    // State for form data
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
        verificationCode: "",
    });

    // State for messages and loading indicators
    const [message, setMessage] = useState({ text: '', type: '' });
    const [codeSent, setCodeSent] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [signingUp, setSigningUp] = useState(false);

    const navigate = useNavigate();

    // --- Handlers ---

    // Update form data state on input change
    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));

        // Basic immediate username validation feedback (optional)
        if (name === 'username') {
            if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
                 setMessage({ text: 'Username can only contain letters, numbers, and underscore (_).', type: 'warning' });
            } else if (message.type === 'warning' && message.text.includes('Username can only contain')) {
                 setMessage({ text: '', type: '' }); // Clear warning if valid again
            }
        }
    };

    // Handle sending the verification code
    const handleSendCode = async () => {
        setMessage({ text: '', type: '' }); // Clear previous messages
        const emailRegex = /\S+@\S+\.\S+/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            setMessage({ text: 'Please enter a valid email address.', type: 'error' });
            return;
        }

        setSendingCode(true);
        setCodeSent(false); // Reset in case of re-request

        try {
            const response = await fetch('http://localhost:5000/api/auth/send-verification-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
                // No credentials needed here usually
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ text: data.message || 'Verification code sent!', type: 'success' });
                setCodeSent(true); // Indicate code was requested successfully
            } else {
                setMessage({ text: data.message || 'Failed to send code.', type: 'error' });
                setCodeSent(false);
            }
        } catch (error) {
            console.error('Send code error:', error);
            setMessage({ text: 'Failed to send code due to a network issue.', type: 'error' });
            setCodeSent(false);
        } finally {
            setSendingCode(false);
        }
    };

    // Handle the main signup submission
    const handleSignup = async (event) => {
        event.preventDefault();
        setMessage({ text: '', type: '' }); // Clear previous messages

        // --- Frontend Validation ---
        const { fullname, username, email, password, confirmpassword, verificationCode } = formData;
        if (!fullname || !username || !email || !password || !confirmpassword || !verificationCode) {
            setMessage({ text: 'All fields are required.', type: 'error' });
            return;
        }
        if (!codeSent) {
             setMessage({ text: 'Please request and enter the verification code first.', type: 'error' });
             return;
        }
        if (password !== confirmpassword) {
            setMessage({ text: 'Passwords do not match.', type: 'error' });
            return;
        }
        const usernameRegex = /^[a-zA-Z0-9_]{3,}$/; // Alphanumeric + underscore, min 3 chars
        if (!usernameRegex.test(username)) {
            setMessage({ text: 'Username must be at least 3 characters and contain only letters, numbers, or underscore (_).', type: 'error' });
            return;
        }
         const emailRegex = /\S+@\S+\.\S+/;
         if (!emailRegex.test(email)) {
             setMessage({ text: 'Please enter a valid email address.', type: 'error' });
             return;
         }
        if (password.length < 6) {
             setMessage({ text: 'Password must be at least 6 characters long.', type: 'error' });
             return;
        }
        // Basic check for verification code format/length if desired (e.g., 6 chars)
        if (verificationCode.length !== 6) { // Assuming 6-char hex code
             setMessage({ text: 'Verification code must be 6 characters.', type: 'error' });
             return;
        }

        // --- API Call ---
        setSigningUp(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData), // Send all form data
                credentials: 'include', // Include cookies (backend will set JWT cookie)
            });

            const data = await response.json();

            if (response.status === 201) { // Check for 201 Created status
                setMessage({ text: data.message || 'Signup successful! Redirecting...', type: 'success' });
                console.log("Signup Successful. User:", data.user);

                // Redirect to the new user's profile page
                if (data.user && data.user.username) {
                    // Use setTimeout to show success message briefly before redirect
                    setTimeout(() => {
                         navigate(`/profile/${data.user.username}`);
                    }, 1500); // Wait 1.5 seconds
                 } else {
                    // Fallback if username is missing (shouldn't happen)
                     console.warn("Username missing in signup response, redirecting to login.");
                     setTimeout(() => {
                         navigate('/login');
                     }, 1500);
                 }
            } else {
                // Handle errors (400, 409 Conflict, 500, etc.)
                setMessage({ text: data.message || 'Signup failed. Please check your input.', type: 'error' });
                console.error("Signup Failed:", data.message);
            }

        } catch (error) {
            console.error('Signup submission error:', error);
            setMessage({ text: 'Signup failed due to a network or server issue.', type: 'error' });
        } finally {
            setSigningUp(false);
        }
    };

    // --- Render ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-100 flex justify-center items-center p-4">
            <div className="bg-white p-8 shadow-xl rounded-lg max-w-lg w-full border border-gray-200"> {/* Increased max-width */}
                <div className="text-center mb-6">
                    <Link to="/" className="inline-block mb-3">
                        <img src={logo} alt='WorthVerse Logo' className="w-20 h-20 mx-auto transition-transform duration-300 hover:scale-110" />
                    </Link>
                    <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Create Your Account</h2>
                    <p className="text-sm text-gray-500 mt-1">Join WorthVerse today!</p>
                </div>

                {/* Message Display */}
                {message.text && (
                    <div className={`mb-4 p-3 rounded-md text-sm ${
                        message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                        message.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-red-100 text-red-800 border border-red-200' // Default to error
                    }`} role="alert">
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                    {/* Input Row 1: Full Name & Username */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input id="fullname" name="fullname" type="text" required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                placeholder="Your full name" value={formData.fullname} onChange={handleOnChange} />
                        </div>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input id="username" name="username" type="text" required pattern="^[a-zA-Z0-9_]{3,}$"
                                title="Min 3 chars, letters, numbers, underscore only"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                placeholder="Choose a username" value={formData.username} onChange={handleOnChange} />
                             {/* Optional: add small text hint */}
                             <p className="mt-1 text-xs text-gray-500">Letters, numbers, underscore only (min 3).</p>
                        </div>
                    </div>

                    {/* Input Row 2: Email & Send Code */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="flex items-stretch space-x-2">
                            <input id="email" name="email" type="email" required
                                className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                placeholder="you@example.com" value={formData.email} onChange={handleOnChange} />
                            <button type="button" onClick={handleSendCode} disabled={sendingCode || !formData.email}
                                className={`flex-shrink-0 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${sendingCode || !formData.email ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out`}>
                                {sendingCode ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                                {codeSent ? 'Resend Code' : 'Send Code'}
                            </button>
                        </div>
                    </div>

                    {/* Input Row 3: Verification Code */}
                    <div>
                        <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                        <input id="verificationCode" name="verificationCode" type="text" required maxLength={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            placeholder="Enter 6-digit code" value={formData.verificationCode} onChange={handleOnChange} disabled={!codeSent} />
                        {codeSent && <p className="mt-1 text-xs text-gray-500">Check your email for the code.</p>}
                    </div>


                    {/* Input Row 4: Password & Confirm Password */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input id="password" name="password" type="password" required minLength={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                placeholder="Create a password" value={formData.password} onChange={handleOnChange} />
                                <p className="mt-1 text-xs text-gray-500">Min 6 characters.</p>
                        </div>
                        <div>
                            <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input id="confirmpassword" name="confirmpassword" type="password" required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                placeholder="Confirm your password" value={formData.confirmpassword} onChange={handleOnChange} />
                        </div>
                    </div>

                    {/* Signup Button */}
                    <button type="submit" disabled={signingUp || !codeSent}
                        className={`w-full flex justify-center items-center bg-indigo-600 text-white p-2.5 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${signingUp || !codeSent ? 'opacity-70 cursor-not-allowed' : ''}`}>
                        {signingUp ? (
                            <><i className="fas fa-spinner fa-spin mr-2"></i>Creating Account...</>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <div className="text-center mt-6 text-sm text-gray-600">
                    <p>Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
// --- END OF REGENERATED FILE Signup.jsx ---