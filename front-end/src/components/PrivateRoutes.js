import {React, useEffect, useState }from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import axios from 'axios';
//import { useAuth } from './AuthContext'

const PrivateRoutes = () => {
    const [ isAuthenticated, setIsAuthenticated ] = useState(false);
    console.log('Authenticated:', isAuthenticated)

    const checkAuth = async () => {
        try {
            axios.get('http://localhost:5001/check-auth')
            .then(res => {
                if( res.data.authenticated === true) {
                    setIsAuthenticated(true)

                } else {
                    setIsAuthenticated(false)
                }
            })
        } catch (error) {
            console.error('Authentication check failed', error);
        }
    };

    return (
        isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" />
    )
};

export default PrivateRoutes;