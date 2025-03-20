import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/logo.png';

function Signup() {
    const [credentials, setCredentials] = useState({ fullname: "", email: "", username: "", password: "", confirmpassword: "", verificationCode: "" });
    const [message, setMessage] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false); // Track email verification status
    const [emailSentMessage, setEmailSentMessage] = useState('');
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [emailInputDisabled, setEmailInputDisabled] = useState(false);

    const handleOnChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSendCode = async () => {
        setEmailSentMessage(''); // Clear previous email messages
        setIsSendingCode(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/send-verification-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: credentials.email }),
            });

            const data = await response.json();
            setIsSendingCode(false);
            if (response.ok) {
                setEmailSentMessage({ text: data.message, type: 'success' });
                setIsEmailVerified(true); // Consider email as 'verification process started'
                setEmailInputDisabled(true); // Disable email input after sending code
            } else {
                setEmailSentMessage({ text: data.message, type: 'error' });
                setIsEmailVerified(false);
            }
        } catch (error) {
            setIsSendingCode(false);
            console.error('Error sending verification code:', error);
            setEmailSentMessage({ text: 'Failed to send verification code. Please try again.', type: 'error' });
            setIsEmailVerified(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous signup messages

        if (!isEmailVerified) { // Basic check, you can enhance verification flow
            setMessage({ text: 'Please verify your email before signing up.', type: 'error' });
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ text: data.message, type: 'success' });
                setCredentials({ fullname: "", email: "", username: "", password: "", confirmpassword: "", verificationCode: "" }); // Clear all fields
                setIsEmailVerified(false); // Reset verification status
                setEmailInputDisabled(false); // Re-enable email input for next signup
                setEmailSentMessage(''); // Clear email sent message
            } else {
                setMessage({ text: data.message, type: 'error' });
            }
        } catch (error) {
            console.error('Signup error:', error);
            setMessage({ text: 'Signup failed. Please try again later.', type: 'error' });
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
                    <h3 className="text-lg font-bold text-gray-800">Create Account</h3>
                </div>
                {message && (
                    <div className={`mb-3 p-2 rounded ${message.type === 'success' ? 'bg-green-200 text-green-800 self-center' : 'bg-red-200 text-red-800'}`}>
                        {message.text}
                    </div>
                )}
                {emailSentMessage && (
                    <div className={`mb-3 p-2 rounded ${emailSentMessage.type === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {emailSentMessage.text}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <input name='fullname' type="text" className="w-full p-2 mb-3 border rounded" placeholder="Full Name" value={credentials.fullname} onChange={handleOnChange} required />
                    <input name='username' type="text" className="w-full p-2 mb-3 border rounded" placeholder="Username" value={credentials.username} onChange={handleOnChange} required />
                    <div className="flex gap-2 mb-3">
                        <input
                            type="email"
                            name='email'
                            className="w-full p-2 border rounded"
                            placeholder="Email Address"
                            value={credentials.email}
                            onChange={handleOnChange}
                            required
                            disabled={emailInputDisabled} // Disable input after sending code
                        />
                        <button
                            type="button"
                            className="bg-gray-800 text-white px-4 py-2 rounded text-sm"
                            onClick={handleSendCode}
                            disabled={isSendingCode || emailInputDisabled} // Disable button while sending or if email is already sent
                        >
                            {isSendingCode ? 'Sending...' : 'Send Code'}
                        </button>
                    </div>
                    {isEmailVerified && (
                        <input
                            type="text"
                            name='verificationCode'
                            className="w-full p-2 mb-3 border rounded"
                            placeholder="Verification Code"
                            value={credentials.verificationCode}
                            onChange={handleOnChange}
                            required
                        />
                    )}
                    <input type="password" name='password' className="w-full p-2 mb-3 border rounded" placeholder="Password" value={credentials.password} onChange={handleOnChange} required />
                    <input type="password" name='confirmpassword' className="w-full p-2 mb-3 border rounded" placeholder="Confirm Password" value={credentials.confirmpassword} onChange={handleOnChange} required />
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