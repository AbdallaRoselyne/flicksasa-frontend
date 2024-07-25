import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown, FaHeart, FaPlus, FaSpinner, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useUser } from './context';
import api from '../api';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const MovieDetail = () => {
    const { user } = useUser();
    const { movieId } = useParams();
    const location = useLocation();
    const typeParam = new URLSearchParams(location.search).get('type');
    const type = typeParam === 'tv' ? 'tv' : 'movie';
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [iframeLoading, setIframeLoading] = useState(true);
    const [interaction, setInteraction] = useState({ liked: false, disliked: false, loved: false, watchlist: false });
    const [trailerKey, setTrailerKey] = useState('');

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await api.get(`/api/movies/details/${movieId}?type=${type}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setMovie(response.data);
                const interactionResponse = await api.get('/api/movies/interactions', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const movieInteraction = interactionResponse.data.find(inter => inter.movieId === movieId);
                if (movieInteraction) {
                    setInteraction(movieInteraction);
                }
                const videoKey = response.data.videos.results[0]?.key;
                if (videoKey) {
                    setTrailerKey(videoKey);
                } else {
                    await searchTrailerOnYouTube(response.data.title || response.data.name);
                }
            } catch (error) {
                setError('Failed to fetch movie details.');
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [movieId, type, user.token]);

    const searchTrailerOnYouTube = async (title) => {
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: `${title} trailer`,
                    key: process.env.REACT_APP_YOUTUBE_API_KEY,
                    maxResults: 1,
                },
            });
            if (response.data.items.length > 0) {
                setTrailerKey(response.data.items[0].id.videoId);
            } else {
                setTrailerKey(null);
            }
        } catch (error) {
            console.error('Error searching YouTube for trailer:', error);
            setTrailerKey(null);
        }
    };

    const handleInteraction = async (action) => {
        let updatedInteraction = { ...interaction, [action]: !interaction[action] };

        if (action === 'liked' && updatedInteraction.liked) {
            updatedInteraction = { ...updatedInteraction, disliked: false, loved: false };
        } else if (action === 'loved' && updatedInteraction.loved) {
            updatedInteraction = { ...updatedInteraction, disliked: false, liked: false };
        } else if (action === 'disliked' && updatedInteraction.disliked) {
            updatedInteraction = { ...updatedInteraction, liked: false, loved: false };
        }

        if (action === 'watchlist') {
            updatedInteraction = { ...updatedInteraction, watchlist: !interaction.watchlist };
        }

        setInteraction(updatedInteraction);

        try {
            await api.post('/api/movies/interaction', {
                movieId,
                action: action === 'watchlist' && interaction.watchlist ? 'remove_watchlist' : action,
                type
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} updated successfully!`);
        } catch (error) {
            setInteraction(interaction); // Revert to previous state on error
            toast.error('Failed to update interaction');
        }
    };

    const handleTrailerClick = () => {
        setIsTrailerOpen(true);
        setIframeLoading(true);
    };

    const closeTrailer = () => {
        setIsTrailerOpen(false);
    };

    const handleIframeLoad = () => {
        setIframeLoading(false);
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen bg-black"><FaSpinner className="animate-spin h-12 w-12 text-gray-500" /></div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    // Handle TV shows and movies differently
    const title = movie.title || movie.name;
    const releaseDate = movie.release_date || movie.first_air_date;
    const rating = movie.vote_average;

    return (
        <div className="min-h-screen bg-black text-white p-4 pt-16">
            <div className="relative max-w-6xl mx-auto bg-gray-900 shadow-lg rounded-lg overflow-hidden">
                {movie.backdrop_path ? (
                    <img 
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
                        alt={title} 
                        className="w-full h-96 object-cover opacity-50"
                    />
                ) : (
                    <div className="w-full h-96 bg-gray-800 flex items-center justify-center text-gray-500">No Image Available</div>
                )}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-black opacity-70"></div>
                <div className="relative p-6">
                    <h2 className="text-4xl font-extrabold mb-4">{title}</h2>
                    <p className="text-lg mb-4">{movie.overview}</p>
                    <p className="text-sm mb-2">Release Date: {new Date(releaseDate).toLocaleDateString()}</p>
                    <p className="text-sm mb-4">Rating: {rating}</p>
                    <div className="flex items-center space-x-4 mb-4">
                        <button className={`flex items-center space-x-2 text-gray-400 hover:text-red-500 ${interaction.liked ? 'text-red-500' : ''}`} onClick={() => handleInteraction('liked')}>
                            <FaThumbsUp />
                            <span>Like</span>
                        </button>
                        <button className={`flex items-center space-x-2 text-gray-400 hover:text-red-500 ${interaction.disliked ? 'text-red-500' : ''}`} onClick={() => handleInteraction('disliked')}>
                            <FaThumbsDown />
                            <span>Dislike</span>
                        </button>
                        <button className={`flex items-center space-x-2 text-gray-400 hover:text-red-500 ${interaction.watchlist ? 'text-red-500' : ''}`} onClick={() => handleInteraction('watchlist')}>
                            <FaPlus />
                            <span>{interaction.watchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
                        </button>
                        <button className={`flex items-center space-x-2 text-gray-400 hover:text-red-500 ${interaction.loved ? 'text-red-500' : ''}`} onClick={() => handleInteraction('loved')}>
                            <FaHeart />
                            <span>Love</span>
                        </button>
                    </div>
                    <button onClick={handleTrailerClick} className="bg-red-600 text-white px-4 py-2 rounded mb-4">Watch Trailer</button>
                    {isTrailerOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-3xl">
                                <div className="flex justify-end p-2">
                                    <button onClick={closeTrailer} className="text-gray-500 hover:text-gray-700">
                                        <FaTimes size={24} />
                                    </button>
                                </div>
                                <div className="relative w-full h-96">
                                    {iframeLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                                            <FaSpinner className="animate-spin h-12 w-12 text-white" />
                                        </div>
                                    )}
                                    {trailerKey ? (
                                        <iframe 
                                            width="100%" 
                                            height="100%" 
                                            src={`https://www.youtube.com/embed/${trailerKey}`} 
                                            title="YouTube video player" 
                                            frameBorder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                            onLoad={handleIframeLoad}
                                        ></iframe>
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <p>No trailer available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Details</h3>
                            <p><strong>Runtime:</strong> {movie.runtime || movie.episode_run_time ? `${movie.runtime || movie.episode_run_time[0]} minutes` : 'N/A'}</p>
                            <p><strong>Budget:</strong> ${movie.budget?.toLocaleString() || 'N/A'}</p>
                            <p><strong>Revenue:</strong> ${movie.revenue?.toLocaleString() || 'N/A'}</p>
                            <p><strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(', ')}</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Cast</h3>
                            <ul>
                                {movie.credits && movie.credits.cast ? movie.credits.cast.slice(0, 5).map(member => (
                                    <li key={member.cast_id}>{member.name} as {member.character}</li>
                                )) : <p>No cast information available</p>}
                            </ul>
                        </div>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-xl font-bold mb-2">Reviews</h3>
                        <ul>
                            {movie.reviews && movie.reviews.results ? movie.reviews.results.slice(0, 3).map(review => (
                                <li key={review.id}>
                                    <p><strong>{review.author}:</strong> {review.content}</p>
                                </li>
                            )) : <p>No reviews available</p>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;
