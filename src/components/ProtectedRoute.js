// src/components/ProtectedRoute.js

import { useEffect, useState } from "react";
import { useUser } from "./context";
import { isTokenValid } from "../jwtHelper";
import { useNavigate } from "react-router-dom";
import Lottie from 'lottie-react';
import loadingAnimation from './lottie/loading.json'; 

const ProtectedRoute = ({ children, isAdminRoute = false }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthenticationAndAuthorization = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (isTokenValid(parsedUser.token)) {
          // Check for admin role if required
          if (isAdminRoute && parsedUser.role !== 'admin') {
            navigate("/not-authorized");
          } else {
            setLoading(false);
          }
        } else {
          // Token is invalid, remove user from storage and redirect to login
          localStorage.removeItem("user");
          navigate("/login");
        }
      } else {
        // No user stored, redirect to login
        navigate("/login");
      }
    };

    checkAuthenticationAndAuthorization();
  }, [navigate, isAdminRoute]);

  if (loading) {
    // Render a loading spinner or similar component while loading
    return (
      <div className="flex justify-center items-center py-4">
        <Lottie animationData={loadingAnimation} style={{ width: 100, height: 100 }} />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
