import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export const ProtectedRoute = ({ element, ...props }) => {
   const {isAuthenticated} = useAuth();

   return isAuthenticated ? (
    <Route {...props} element={element}  />
   ) : (
    <Navigate to='/sign-in' /> 
   );
}
