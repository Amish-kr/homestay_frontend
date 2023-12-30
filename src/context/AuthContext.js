import axios from "axios";
import React, { createContext, useEffect, useState, useContext } from "react";

// Create the context
export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  // State for logged-in status
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  // State for user role
  const [userRole, setUserRole] = useState(null);
  // State for user ID
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function getLoggedInStatus() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/loggedIn`,
          {
            withCredentials: true,
          }
        );

        setIsLoggedIn(response.data.loggedIn);

        if (response.data.loggedIn) {
          setUserRole(response.data.role);
        }
      } catch (error) {
        console.error(
          "Error checking logged-in status:",
          error.response?.data || error.message
        );
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    }

    getLoggedInStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, isLoggedIn, userRole, userId }}>
      {props.children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
