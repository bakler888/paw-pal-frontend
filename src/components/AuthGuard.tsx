
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import React from "react";

interface AuthGuardProps {
  requireAuth: boolean;
}

const AuthGuard = ({ requireAuth }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Added isInitialized state to prevent redirect flashing
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  React.useEffect(() => {
    // Mark as initialized after first render
    if (!isLoading) {
      setIsInitialized(true);
    }
  }, [isLoading]);

  // Only show loading during initial load
  if (isLoading && !isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  // Wait for authentication to be determined before redirecting
  if (!isInitialized) {
    return null;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
