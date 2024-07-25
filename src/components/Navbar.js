import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import useLogout from './useLogout'; // Import the custom hook
import { useUser } from './context';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useUser();  // Get user from context
    const logout = useLogout();  // Get logout function from custom hook
    const navigate = useNavigate();
    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    return (
        <nav className="bg-black bg-opacity-75 text-white fixed top-0 left-0 w-full z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="h-8 w-auto" />
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/recommendations" className="hover:text-gray-300">
                                    Home
                                </Link>
                                <Link to="/tv-shows" className="hover:text-gray-300">
                                    TV Shows
                                </Link>
                                <Link to="/movies" className="hover:text-gray-300">
                                    Movies
                                </Link>
                                <Link to="/latest" className="hover:text-gray-300">
                                    Latest
                                </Link>
                                <Link to="/my-list" className="hover:text-gray-300">
                                    My List
                                </Link>
                                <Link to="/help" className="hover:text-gray-300">
                                    FAQ
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <FaUserCircle size={24} className="hover:text-gray-300 cursor-pointer" />
                        {user && (
                            <button
                                onClick={logout}
                                className="hover:text-gray-300"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
                        >
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/recommendations" className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300">
                            Home
                        </Link>
                        <Link to="/tv-shows" className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300">
                            TV Shows
                        </Link>
                        <Link to="/movies" className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300">
                            Movies
                        </Link>
                        <Link to="/latest" className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300">
                            Latest
                        </Link>
                        <Link to="/my-list" className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300">
                            My List
                        </Link>
                        <Link to="/help" className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300">
                            FAQ
                        </Link>
                        {user && (
                            <button
                                onClick={logout}
                                className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 w-full text-left"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
