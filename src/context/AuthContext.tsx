import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getUserInfo, updateUserData } from "../services/api";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface ProfileUpdateData {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: ProfileUpdateData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Function to get user from localStorage
  const getUserFromStorage = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }
        
        // Try to get stored user data
        const storedUser = getUserFromStorage();
        if (storedUser?.id && storedUser?.name) {
          console.log("Using stored user data:", storedUser);
          setUser(storedUser);
        } else {
          // If no valid stored user data, try fetching from API
          try {
            console.log("Fetching user info from API");
            const userData = await getUserInfo();
            if (userData) {
              const userToStore = {
                id: userData.id || userData.userId || "user-id",
                name: userData.userName || userData.name || "User",
                email: userData.email || ""
              };
              setUser(userToStore);
              localStorage.setItem("user", JSON.stringify(userToStore));
            } else {
              throw new Error("No user data returned");
            }
          } catch (error) {
            console.log("Failed to get user info, clearing token", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const userData = await apiLogin(credentials);
      
      if (userData) {
        // Store user data in state
        setUser(userData);
        toast.success("Successfully logged in!");
        
        // Add small delay before navigation to ensure state updates
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
      } else {
        throw new Error("Login failed - no user data returned");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const result = await apiRegister(userData);
      console.log("Registration result:", result);
      
      toast.success("Registration successful! Please log in.");
      
      // Add small delay before navigation
      setTimeout(() => {
        navigate("/login");
      }, 100);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
      setUser(null);
      
      toast.success("Successfully logged out!");
      
      // Add small delay before navigation
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear user data even if API call fails
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: ProfileUpdateData) => {
    setIsLoading(true);
    try {
      // Call API to update user data
      await updateUserData(data);
      
      // Update local user state
      if (user) {
        const updatedUser = {
          ...user,
          name: data.name,
          email: data.email
        };
        setUser(updatedUser);
        
        // Update user in localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Use the memo pattern to prevent unnecessary re-renders
  const value = React.useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUserProfile
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
