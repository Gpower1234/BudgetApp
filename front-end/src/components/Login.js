import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import { MoonLoader } from 'react-spinners';
import '../CSS/Login.css';
//import './styles/login.css';


export const SignIn = () => {

  //const [username, setUsername] = useState("");
  //const [password, setPassword] = useState("");
  //const [error, setError] = useState("");

  const [formData, setFormData] = useState({ username: '', password: ''})
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  }

  const navigate = useNavigate();

  const handleLoginWithGoogle = (response) => {
    axios.post('/auth/google', response)
    .then((res) => {
      // Handle the response from the server
      if (res.data.success) {
        navigate('/dashboard')
      } else {
        alert('Login failed: Please try again.')
      }
    })
    .catch((error) => {
      console.error('Error:', error)
      // Handle errors
    })
  };

  const handleLocalLogin = (e) => {
    e.preventDefault();
    setIsLoading(true)
    // Send the username and password to the backend for local login
    axios.post('http://localhost:5001/login', formData)
    .then((res) => {
      if (res.data.status === 'success') {
        setTimeout(() => {
          setIsLoading(false)
          navigate(`/?message=${encodeURIComponent('logged in success')}`)
        }, 3000)} else {
          console.log('Error')
        }
      // Redirect to the dashboard or handle user state as needed
    }).catch((error) => {
      console.error(error);
    });
  }
{/*
  function handleChangeUsername(event) {
    setUsername(event.target.value)
  };

  function handleChangePassword(event) {
    setPassword(event.target.value)
  };
*/}
  return (
    <div className='login-container'>
      <div className='row justify-content-center'>
        <div className='col-md-4 col-8'>
          <h4 style={{ color: '#87ceeb', fontFamily: 'monospace', marginBottom: '50px'}} className='text-center'>Sign <b style={{fontFamily: 'monospace', color: '#87cefa'}}>In</b></h4>
          
          {/*<div className='mb-3 text-center'>
            <button style={{ backgroundColor: '#f43', color: '#fff', border: 'none', borderRadius: '5px' }} onClick={handleLoginWithGoogle}>Login with Google</button>
  </div>*/}
          {/*<GoogleLogin
          clientId="YOUR GOOGLE CLIENT ID"
          buttonText="Login with Google"
          onSuccess={handleLoginWithGoogle}
          onFailure={handleLoginWithGoogle}
          cookiePolicy={'single_host_origin'}
/>*/}
          <div className='mb-3 text-center' style={{ marginTop: '50px' }}>
            <h5 style={{color: '#fff'}}>or</h5>
          </div>
          {isLoading &&
          <div className='col-md-3 col-8' style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '9999'}}>
              {isLoading && <MoonLoader size={30} color={'red'} />}
          </div>
          }
          <div style={{ marginTop: '50px' }}>
            
            <form onSubmit={handleLocalLogin}>
              <div className='mb-3'>
                <label  htmlFor='username'className='form-label'>Username</label>
                <input type='text' className='form-control' id='username' placeholder='Enter username' name='username' onChange={handleInputChange} />
              </div>
              <div className='mb-3'>
                <label  htmlFor='password'className='form-label'>Password</label>
                <input type='password' className='form-control' id='password' placeholder='Enter password' name='password' onChange={handleInputChange} />
              </div>
              <p>Don't have an account? <Link to='/sign-up' style={{ color: '#dc3545', textDecoration: 'none' }}>Sign Up</Link></p>
              <div className='text-center'>
                <button type='submit' className='btn btn-danger'>Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
};
