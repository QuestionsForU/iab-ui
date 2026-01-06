import { Navigate } from "react-router-dom";
import Layout from "../Layout";
import { useAuth } from "../provider/authProvider";

export const ProtectedRoute = () => {
  const { token } = useAuth();

  // Check if the user is authenticated
  if (!token) {
    
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      return <Navigate to="/refresh" />
    }
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child routes
  return <Layout />;
};
