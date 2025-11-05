import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    // console.log("ProtectedRoute running...");
    // console.log("Token in ProtectedRoute:", !!token);

  if (!token) {
    return <Navigate to="/login" replace />;
    console.log("No token found, redirecting to /login");
  }
  return children;
};

export default ProtectedRoute;
