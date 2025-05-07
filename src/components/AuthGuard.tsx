
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
    // User is not authenticated but trying to access protected route
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // User is authenticated but trying to access public route
    console.log("User authenticated, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // Either the user is authenticated and accessing a protected route,
  // or the user is not authenticated and accessing a public route
  return <Outlet />;
};

export default AuthGuard;
