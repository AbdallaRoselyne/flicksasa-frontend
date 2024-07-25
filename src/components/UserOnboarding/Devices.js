// src/components/UserOnboarding/Devices.js
import React from 'react';
import { FaCheck, FaSpinner } from 'react-icons/fa';

const devicesList = [
    { name: 'Smartphone', logo: '/devices/smartphone.jpeg' },
    { name: 'Tablet', logo: '/devices/tablet.jpeg' },
    { name: 'Laptop', logo: '/devices/Laptop.png' },
    { name: 'Smart TV', logo: '/devices/smart-tv.jpg' },
    { name: 'Desktop', logo: '/devices/desktop.png' },
    { name: 'Gaming Console', logo: '/devices/console.png' },
];

const Devices = ({ formData, setFormData, submitForm, prevStep, loading }) => {
    const handleCheckboxChange = (device) => {
        if (formData.devices.includes(device.name)) {
            setFormData({ ...formData, devices: formData.devices.filter(d => d !== device.name) });
        } else {
            setFormData({ ...formData, devices: [...formData.devices, device.name] });
        }
    };

    const isFormValid = formData.devices.length > 0;

    return (
        <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white mb-2 text-center">Select Your Devices</h2>
            <form className="mt-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {devicesList.map((device) => (
                        <div
                            key={device.name}
                            className={`relative p-2 border-2 rounded-md cursor-pointer transition ${
                                formData.devices.includes(device.name) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-200 text-gray-900 border-gray-300'
                            }`}
                            onClick={() => handleCheckboxChange(device)}
                        >
                            <img src={device.logo} alt={device.name} className="w-8 h-8 absolute top-1 left-2" />
                            {formData.devices.includes(device.name) && (
                                <FaCheck className="absolute top-2 right-2 text-white" />
                            )}
                            <span className="ml-10">{device.name}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-6">
                    <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={submitForm}
                        className={`group relative px-4 py-2 rounded-md flex justify-center items-center ${
                            isFormValid ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-300 text-gray-700 cursor-not-allowed'
                        }`}
                        disabled={!isFormValid || loading}
                    >
                        {loading && <FaSpinner className="absolute left-3 animate-spin" />}
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Devices;
