import React, { useState, useEffect } from 'react';
import api from '../../api'; // Make sure to have your API set up for this
import { useNavigate, useLocation } from 'react-router-dom';

const VerificationPage = () => {
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Retrieve email from state passed down through navigation
        if (location.state?.email) {
            setEmail(location.state.email);
            setMessage(`A verification code has been sent to ${location.state.email}. Please check your inbox and spam folder.`);
        } else {
            setError("No email address found. Please try again.");
        }
    }, [location.state]);

    const handleInputChange = (event) => {
        setCode(event.target.value);
    };

    const handleVerify = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await api.post('/api/auth/verify-code', { email, code });
            // Check for successful verification
            if (response.status === 200) {
                navigate("/reset-password", { state: { email: email } });
            } else {
                setError('Verification failed. Please try again or resend the code.');
            }
        } catch (error) {
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Countdown logic
        let interval = null;
        if (timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timeLeft]);

    const handleResendCode = async () => {
        setLoading(true);
        setError('');
        setMessage('Sending a new code...');

        try {
            const response = await api.post('/api/auth//resend-verification-code', { email });

            if (response.status === 200) {
                setMessage(`A new verification code has been sent to ${email}. Please check your inbox and spam folder.`);
                setTimeLeft(60); // Start the countdown again
            } else {
                setError('Failed to resend code. Please try again later.');
            }
        } catch (error) {
            setError('Failed to resend code. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
             style={{ backgroundImage: "url('/african-couple-cinema_7502-8361.jpg')",
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat' }}>
            <div className="bg-black bg-opacity-70 p-8 rounded-lg max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-white mb-2">Enter Verification Code 🍿</h2>
                    {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 text-xs py-3 rounded relative mb-4" role="alert">{message}</div>}
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleVerify}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    )}

                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="verification-code" className="sr-only">Verification Code</label>
                            <input
                                id="verification-code"
                                name="verification-code"
                                type="tel"
                                required
                                className="block w-full pl-3 text-xs pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Verification Code"
                                value={code}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button type="submit" disabled={loading} className="relative w-full flex justify-center text-xs py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                            {loading ? 'Verifying...' : 'Verify'}
                        </button>
                    </div>
                </form>
                <button onClick={handleResendCode} disabled={loading || timeLeft > 0} className="mt-4 text-sm underline text-emerald-600 hover:text-emerald-500">
                    {timeLeft > 0 ? `Resend Code in (${timeLeft}s)` : 'Resend Code'}
                </button>
            </div>
        </div>
    );
}

export default VerificationPage;
