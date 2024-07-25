// src/components/Latest.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import MovieCard from './MovieCard';
import { useUser } from './context';
import { FaSpinner } from 'react-icons/fa';

const Latest = () => {
    const { user } = useUser();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLatestMovies = async () => {
            try {
                const response = await api.get('/api/movies/latest', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setMovies(response.data);
            } catch (error) {
                setError('Failed to fetch latest movies.');
            } finally {
                setLoading(false);
            }
        };

        fetchLatestMovies();
    }, [user.token]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen bg-black"><FaSpinner className="animate-spin h-12 w-12 text-gray-500" /></div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 pt-16">
            <h2 className="text-3xl font-extrabold text-red-600 mb-6">Latest Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default Latest;
