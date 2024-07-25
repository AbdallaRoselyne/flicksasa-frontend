// src/components/UserOnboarding/UserInfo.js
import React from 'react';
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineGlobal } from 'react-icons/ai';
import { FaCalendarAlt } from 'react-icons/fa';

const UserInfo = ({ formData, setFormData, nextStep }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        nextStep();
    };

    return (
        <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-center text-white mb-2">User Information</h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md shadow-sm space-y-4">
                    <div className="relative">
                        <label htmlFor="firstName" className="sr-only">First Name</label>
                        <AiOutlineUser className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-black bg-opacity-60 text-white placeholder-gray-400"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="lastName" className="sr-only">Last Name</label>
                        <AiOutlineUser className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-black bg-opacity-60 text-white placeholder-gray-400"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="age" className="sr-only">Age</label>
                        <FaCalendarAlt className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
                        <input
                            id="age"
                            name="age"
                            type="number"
                            required
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-black bg-opacity-60 text-white placeholder-gray-400"
                            placeholder="Age"
                            value={formData.age}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="email" className="sr-only">Email</label>
                        <AiOutlineMail className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-black bg-opacity-60 text-white placeholder-gray-400"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="phone" className="sr-only">Phone</label>
                        <AiOutlinePhone className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            required
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-black bg-opacity-60 text-white placeholder-gray-400"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="country" className="sr-only">Country</label>
                        <AiOutlineGlobal className="absolute top-3 left-3 text-emerald-500" size="1.25em" />
                        <input
                            id="country"
                            name="country"
                            type="text"
                            required
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-black bg-opacity-60 text-white placeholder-gray-400"
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <button type="submit" className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition">
                    Next
                </button>
            </form>
        </div>
    );
};

export default UserInfo;
