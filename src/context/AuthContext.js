import axios from "axios";
import React, { createContext, useEffect, useState, useContext } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const [userRole, setUserRole] = useState(null);

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
    <AuthContext.Provider value={{ isLoading, isLoggedIn, userRole }}>
      {props.children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
