import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from './Auth/register';
import Login from './Auth/login';
import ForgotPassword from './Auth/ForgotPassword';
import Verify from './Auth/verify';
import VerificationPage from './Auth/VerificationPage';
import ResetPassword from './Auth/ResetPassword';
import PhoneVerify from './Auth/PhoneVerify';
import ChangeNumber from './Auth/ChangeNumber';
import LandingPage from './LandingPage';
import UserOnboarding from './UserOnboarding/UserOnboarding';
import Recommendations from './Recommendations';
import MovieDetail from './MovieDetail'; // Import the MovieDetail component
import ProtectedRoute from './ProtectedRoute';
import Navbar from './Navbar';
import TvShows from './TvShows';
import MyList from './MyList';
import Movies from './Movies';
import Latest from './Latest';
import Help from './Help';
import AdminUsers from './admin/Users'; // Import the AdminUsers component

const AppLayout = () => {
    return (
        <>
            <Navbar /> {/* Include the Navbar */}
            <div className="pt-16"> {/* Added top padding to avoid overlap with Navbar */}
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify" element={<Verify />} />
                    <Route path="/verification" element={<VerificationPage />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/phone-verify" element={<PhoneVerify />} />
                    <Route path="/changeNumber" element={<ChangeNumber />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/onboarding" element={<ProtectedRoute><UserOnboarding /></ProtectedRoute>} />
                    <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
                    <Route path="/movies/:movieId" element={<ProtectedRoute><MovieDetail /></ProtectedRoute>} /> {/* Added route for MovieDetail */}
                    <Route path="/tv-shows" element={<ProtectedRoute><TvShows /></ProtectedRoute>} />
                    <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
                    <Route path="/latest" element={<ProtectedRoute><Latest /></ProtectedRoute>} />
                    <Route path="/my-list" element={<ProtectedRoute><MyList /></ProtectedRoute>} />
                    <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} /> {/* Added route for AdminUsers */}
                    <Route path="*" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
                </Routes>
            </div>
        </>
    );
};

export default AppLayout;
