// AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [setErrorMessage] = useState('')


  useEffect(() => {
    // Check authentication status on initial load
    axios.get('/api/check-auth')
      .then((response) => {
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
        }
      })
      .catch((error) => console.error('Authentication check failed:', error));
  }, []);

  const login = async () => {
    try {
      // Redirect the user to the Google authentication page
      window.location.href = '/auth/google';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    try {
      // Make a request to your backend logout endpoint
      const response = await axios.get('/logout');
      
      // Check if the logout request was successful
      if (response.status === 200) {
        setUser(null);
        window.location.href = '/sign-in';
      } else {
        // Handle unsuccessful logout
        setErrorMessage('Failed to logout')

      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const authFunctions = {
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={{ user, ...authFunctions }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

