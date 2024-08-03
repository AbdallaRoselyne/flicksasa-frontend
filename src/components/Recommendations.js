import React, { useEffect, useState } from 'react';
import api from '../api';
import MovieCard from './MovieCard';
import FeaturedMovieCard from './FeaturedMovieCard';
import { useUser } from './context';
import Lottie from 'lottie-react';
import loadingAnimation from './lottie/loading.json';
import { debounce } from 'lodash';
import { FaSpinner } from 'react-icons/fa';

const Recommendations = () => {
    const { user } = useUser();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [mlSearchResults, setMlSearchResults] = useState([]); // New state for ML search results

    useEffect(() => {
        const fetchRecommendedMovies = async () => {
            try {
                const response = await api.get('/api/movies/recommendations', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (response.status === 200) {
                    const results = response.data.results || response.data;
                    if (Array.isArray(results)) {
                        if (results.length > 0) {
                            setMovies(results);
                        } else {
                            setError('No recommended movies found.');
                        }
                    } else {
                        setError('Unexpected response format.');
                    }
                } else {
                    setError('Failed to load recommended movies.');
                }
            } catch (error) {
                setError(error.response?.data?.message || error.message || 'Failed to load recommended movies.');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.token) {
            fetchRecommendedMovies();
        } else {
            setError('User not authenticated.');
            setLoading(false);
        }
    }, [user]);

    const debouncedSearch = debounce(async (query) => {
        if (!query) {
            setSearchResults([]);
            setSearchLoading(false);
            return;
        }

        setSearchLoading(true);
        try {
            const response = await api.get(`/api/movies/search?query=${query}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 200) {
                setSearchResults(response.data.results || response.data);
            } else {
                setError('Failed to search for movies.');
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Failed to search for movies.');
        } finally {
            setSearchLoading(false);
        }
    }, 300);

    // New debounced search for ML recommendations
    const debouncedMLSearch = debounce(async (query) => {
        if (!query) {
            setMlSearchResults([]);
            setSearchLoading(false);
            return;
        }

        setSearchLoading(true);
        try {
            const response = await api.get(`/api/movies/search-with-ml?query=${query}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 200) {
                setMlSearchResults(response.data.results || response.data);
            } else {
                setError('Failed to search for movies with ML.');
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Failed to search for movies with ML.');
        } finally {
            setSearchLoading(false);
        }
    }, 300);

    useEffect(() => {
        debouncedSearch(searchQuery);
        debouncedMLSearch(searchQuery); // Trigger ML search
    }, [searchQuery]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <Lottie animationData={loadingAnimation} loop={true} autoplay={true} height={150} width={150} />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    const moviesToDisplay = searchQuery ? searchResults.concat(mlSearchResults) : movies; // Combine regular and ML search results
    const recommendedMovies = moviesToDisplay.slice(0, 8); // First 8 movies for 2 rows

    // Group movies by genre
    const groupMoviesByGenre = (movies) => {
        return movies.reduce((acc, movie) => {
            if (Array.isArray(movie.genre_ids)) { // Check if genre_ids is an array
                movie.genre_ids.forEach((genreId) => {
                    if (!acc[genreId]) {
                        acc[genreId] = [];
                    }
                    acc[genreId].push(movie);
                });
            }
            return acc;
        }, {});
    };

    const genreMap = {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Science Fiction',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western'
    };

    // Filter movies to exclude those without genre_ids
    const moviesWithGenres = moviesToDisplay.filter(movie => Array.isArray(movie.genre_ids));
    const otherMoviesGroupedByGenre = groupMoviesByGenre(moviesWithGenres.slice(8));

    return (
        <div className="min-h-screen flex flex-col items-center bg-black text-white p-4 pt-20">  {/* Added pt-20 */}
            <h2 className="text-3xl font-extrabold text-red-600 mb-6">Recommended Movies</h2>

            <div className="mb-6 w-full max-w-md relative">
                <input
                    type="text"
                    placeholder="Search for movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                    style={{ paddingRight: '2.5rem' }} // Adjust for spinner space
                />
                {searchLoading && (
                    <FaSpinner className="animate-spin absolute right-2 top-2.5 text-red-600" />
                )}
            </div>

            {recommendedMovies.length > 0 && <FeaturedMovieCard movie={recommendedMovies[0]} />}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mt-6 w-full px-4">
                {recommendedMovies.slice(1).map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            {Object.keys(otherMoviesGroupedByGenre).map((genreId) => (
                <div key={genreId} className="w-full px-4 mt-12">
                    <h2 className="text-2xl font-extrabold text-red-600 mb-6">{genreMap[genreId]}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                        {otherMoviesGroupedByGenre[genreId].map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Recommendations;

