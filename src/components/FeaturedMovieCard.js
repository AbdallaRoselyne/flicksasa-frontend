import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedMovieCard = ({ movie }) => {
    const releaseYear = new Date(movie.release_date).getFullYear();

    return (
        <Link to={`/movies/${movie.id}`} className="relative bg-black shadow-lg rounded-sm overflow-hidden w-full mb-6">
         <div className="relative bg-black shadow-lg rounded-sm overflow-hidden w-full mb-6">
            <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                className="w-full h-96 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-4">
                <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
                <p className="text-lg mb-4">{releaseYear}</p>
                <p className="text-sm mb-2">{movie.overview}</p>
                <p className="text-sm">Rating: {movie.vote_average}</p>
            </div>
        </div>
        </Link>
    );
};

export default FeaturedMovieCard;
