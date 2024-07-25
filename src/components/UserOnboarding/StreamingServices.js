// src/components/UserOnboarding/StreamingServices.js
import React from 'react';
import { FaCheck } from 'react-icons/fa';

const streamingServicesList = [
    { name: 'Netflix', logo: '/services/Netflix_logo.svg' },
    { name: 'Amazon Prime', logo: '/services/prime_logo.png' },
    { name: 'Hulu', logo: '/services/hulu.png' },
    { name: 'Disney+', logo: '/services/Disney.svg' },
    { name: 'HBO Max', logo: '/services/HBO_Max.svg' },
    { name: 'Apple TV+', logo: '/services/Apple_logo.png' },
];

const StreamingServices = ({ formData, setFormData, nextStep, prevStep }) => {
    const handleCheckboxChange = (service) => {
        if (formData.streamingServices.includes(service.name)) {
            setFormData({ ...formData, streamingServices: formData.streamingServices.filter(s => s !== service.name) });
        } else {
            setFormData({ ...formData, streamingServices: [...formData.streamingServices, service.name] });
        }
    };

    const isFormValid = formData.streamingServices.length > 0;

    return (
        <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white mb-2 text-center">Select Your Streaming Services</h2>
            <form className="mt-8 space-y-6">
                <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
                    {streamingServicesList.map((service) => (
                        <div
                            key={service.name}
                            className={`relative p-2 border-2 rounded-md cursor-pointer transition ${
                                formData.streamingServices.includes(service.name) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-200 text-gray-900 border-gray-300'
                            }`}
                            onClick={() => handleCheckboxChange(service)}
                        >
                            <img src={service.logo} alt={service.name} className="w-8 h-8 absolute top-1 left-2" />
                            {formData.streamingServices.includes(service.name) && (
                                <FaCheck className="absolute top-3 right-2 text-white" />
                            )}
                            <span className="ml-10">{service.name}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-6">
                    <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={nextStep}
                        className={`px-4 py-2 rounded-md ${
                            isFormValid ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-300 text-gray-700 cursor-not-allowed'
                        }`}
                        disabled={!isFormValid}
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StreamingServices;
