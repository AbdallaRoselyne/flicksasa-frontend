// src/components/Auth/login.js

import { useState, useEffect } from 'react';
import api from '../../api';
import { useUser } from '../context';
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineMail, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLock } from 'react-icons/ai';
import { FaSpinner } from 'react-icons/fa';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const getFingerprint = async () => {
    try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId;
    } catch (error) {
        console.error("Error obtaining fingerprint:", error);
        return null;
    }
};

const Login = () => {
    const { login, logout } = useUser();
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        logout();
    }, [logout]);

    const handlePasswordVisibility = () => setShowPassword(!showPassword);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLoginData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const fingerprintId = await getFingerprint();
            const loginDataWithFingerprint = { ...loginData, fingerprintId };
            const response = await api.post('/api/auth/login', loginDataWithFingerprint);

            if (response.status === 200) {
                const user = response.data;
                login(user);

                if (user.redirectToOnboarding) {
                    console.log('Redirecting to onboarding');
                    navigate('/onboarding');
                } else {
                    console.log('Redirecting to dashboard');
                    navigate('/recommendations');
                }
            } else {
                setError('Login failed due to unexpected response. Please try again later.');
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                if (error.response.data.message.includes('Phone verification needed')) {
                    const { token, phoneNumber } = error.response.data;
                    navigate('/phone-verify', { state: { phoneNumber, token } });
                } else {
                    navigate('/verify', { state: { email: loginData.email, token: error.response.data.token } });
                }
            } else {
                setError(error.response?.data?.message || 'Login failed. Please try again later.');
            }
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
                    <h2 className="text-3xl font-extrabold text-white mb-2">
                        Sign In 🍿
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {error}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setError(null)}>
                                <svg className="fill-current h-6 w-6 text-red-500" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <title>Close</title>
                                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 0 1 1.697 0c.461.486.461 1.211 0 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                </svg>
                            </span>
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4 relative">
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <AiOutlineMail className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="text-xs sm:text-sm block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Email address"
                                value={loginData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <AiOutlineLock className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                className="text-xs sm:text-sm block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                onClick={handlePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs sm:text-sm">
                                {showPassword ? (
                                    <AiOutlineEyeInvisible className="text-emerald-500" size="1.25em" />
                                ) : (
                                    <AiOutlineEye className="text-emerald-500" size="1.25em" />
                                )}
                            </button>
                        </div>
                    </div>
                  
                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                {loading ? <FaSpinner className="h-5 w-5 text-white animate-spin" /> : null}
                            </span>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                        </div>
                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-emerald-600 hover:text-emerald-500 text-xs sm:text-sm">Forgot your password?</Link>
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="text-xs sm:text-sm text-gray-600">Don't have an account?</span>
                        <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500 underline ml-1 text-xs sm:text-sm">Create new account</Link>
                    </div>
                    </form>
            </div>
        </div>
    );
}

export default Login;