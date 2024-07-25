// src/components/UserOnboarding/FavoriteGenres.js
import React from 'react';
import { FaCheck } from 'react-icons/fa';

const genresList = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Fantasy', 'Documentary', 'Animation'];

const FavoriteGenres = ({ formData, setFormData, nextStep, prevStep }) => {
    const handleCheckboxChange = (genre) => {
        if (formData.favoriteGenres.includes(genre)) {
            setFormData({ ...formData, favoriteGenres: formData.favoriteGenres.filter(g => g !== genre) });
        } else {
            setFormData({ ...formData, favoriteGenres: [...formData.favoriteGenres, genre] });
        }
    };

    const isFormValid = formData.favoriteGenres.length > 0;

    return (
        <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white text-center mb-2">Select Your Favorite Genres</h2>
            <form className="mt-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    {genresList.map((genre) => (
                        <div
                            key={genre}
                            className={`relative p-2 border-2 rounded-sm cursor-pointer transition ${
                                formData.favoriteGenres.includes(genre) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-200 text-gray-900 border-gray-300'
                            }`}
                            onClick={() => handleCheckboxChange(genre)}
                        >
                            {formData.favoriteGenres.includes(genre) && (
                                <FaCheck className="absolute top-3 right-2 text-white" />
                            )}
                            <span>{genre}</span>
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

export default FavoriteGenres;
