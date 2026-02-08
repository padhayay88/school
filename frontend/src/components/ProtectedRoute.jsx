import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { owner, loading } = useAuth();
  if (loading) {
    return <div className="content">Checking session...</div>;
  }
  if (!owner) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
