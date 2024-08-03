// src/components/UserOnboarding/UserOnboarding.js
import React, { useState, useEffect } from 'react';
import UserInfo from './UserInfo';
import FavoriteGenres from './FavoriteGenres';
import StreamingServices from './StreamingServices';
import Devices from './Devices';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import loadingAnimation from '../lottie/loading.json';
import { useUser } from '../context'; // Import useUser context
import { FaSpinner } from 'react-icons/fa';

const UserOnboarding = () => {
    const { user } = useUser(); // Get user context
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        email: '',
        phone: '',
        country: '',
        favoriteGenres: [],
        streamingServices: [],
        devices: [],
    });

    const navigate = useNavigate();

    const loadingMessages = [
        'Creating your dashboard...',
        'Fetching your recommendations...',
        'Setting up your profile...',
        'Finalizing details...',
    ];

    useEffect(() => {
        let interval;
        if (loading) {
            interval = setInterval(() => {
                setLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
            }, 4000); // Change message every 2 seconds
        }
        return () => clearInterval(interval);
    }, [loading]);

    const nextStep = () => {
        if (isFormFilled(step)) {
            setStep((prevStep) => prevStep + 1);
        }
    };
    const prevStep = () => setStep((prevStep) => prevStep - 1);

    const isFormFilled = (step) => {
        switch (step) {
            case 0:
                return (
                    formData.firstName &&
                    formData.lastName &&
                    formData.age &&
                    formData.email &&
                    formData.phone &&
                    formData.country
                );
            case 1:
                return formData.favoriteGenres.length > 0;
            case 2:
                return formData.streamingServices.length > 0;
            case 3:
                return formData.devices.length > 0;
            default:
                return false;
        }
    };

    const submitForm = async () => {
        setSubmitting(true);
        setError('');
        try {
            const response = await api.post('/api/kyc', formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200 || response.status === 201) {
                setSubmitting(false);
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    navigate('/recommendations');
                }, 20000); // Increased simulated loading time for creating dashboard
            } else {
                setError(response.data.message || 'Failed to submit KYC data. Please try again.');
                setSubmitting(false);
            }
        } catch (error) {
            console.error("Error submitting form", error);
            setError(error.response?.data?.message || 'Failed to submit KYC data. Please try again.');
            setSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return <UserInfo formData={formData} setFormData={setFormData} nextStep={nextStep} />;
            case 1:
                return <FavoriteGenres formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
            case 2:
                return <StreamingServices formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
            case 3:
                return <Devices formData={formData} setFormData={setFormData} submitForm={submitForm} prevStep={prevStep} loading={submitting} />;
            default:
                return <UserInfo formData={formData} setFormData={setFormData} nextStep={nextStep} />;
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4" 
             style={{ backgroundImage: "url('tv-remote-control-near-spilled-popcorn_23-2147699517.jpg')" }}>
            <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg max-w-md w-full space-y-8 text-white">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}
                {loading ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Lottie animationData={loadingAnimation} style={{ width: 200, height: 200 }} />
                        <p className="text-lg font-semibold text-white text-center mt-4">{loadingMessages[loadingMessageIndex]}</p>
                    </div>
                ) : (
                    renderStep()
                )}
            </div>
        </div>
    );
};

export default UserOnboarding;
