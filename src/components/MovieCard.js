import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie, type }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/movies/${movie.id}?type=${type}`);
    };

    const releaseYear = new Date(movie.release_date || movie.first_air_date).getFullYear();

    return (
        <div
            className="relative bg-gray-800 text-white shadow-md rounded-lg overflow-hidden cursor-pointer"
            onClick={handleCardClick}
        >
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title || movie.name}
                className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                <h3 className="text-md font-bold">{movie.title || movie.name}</h3>
                <p className="text-sm">{releaseYear}</p>
            </div>
        </div>
    );
};

export default MovieCard;
