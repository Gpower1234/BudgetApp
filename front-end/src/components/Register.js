import React, {useState} from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export const Register = () => {
  const [username, setUsername] = useState("");
  //const [firstName, setFirstName] = useState("");
  //const [lastName, setLastName] = useState(""); 
  //const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const [formData, setFormData] = useState({ username: "", password: ""});
  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const navigate = useNavigate();
  
{/*
  function handleChangeUsername(event) {
    setUsername(event.target.value)
  }

  function handleChangeFirstName(event) {
    setFirstName(event.target.value)
  }

  function handleChangeLastName(event) {
    setLastName(event.target.value)
  }

  function handleChangeEmail(event) {
    setEmail(event.target.value)
  }

  function handleChangePassword(event) {
    setPassword(event.target.value)
  }

  function handleChangeConfirmPassword(event) {
    setConfirmPassword(event.target.value)
  }
*/}
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5001/register', formData)
    .then((response) => {
      console.log(response.data);
      navigate('/sign-in')
    }).catch((err) => {
      console.error(err);
    });
  }
  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-md-4 col-8'>
        <h4 style={{ color: 'red', fontFamily: 'monospace'}} className='text-center'>Sign <b className='text-danger'style={{fontFamily: 'monospace'}}>Up</b></h4>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label style={{display:username ? 'block' : 'none', color: '#dc3545'}} htmlFor='email'className='form-label'>Username</label>
              <input type='text' className='form-control' id='username' placeholder='Username' name='username' onChange={handleInputChange} />
            </div>
            
            
            
            <div className='mb-3'>
              <label style={{display:password ? 'block' : 'none', color: '#dc3545'}}  htmlFor='password'className='form-label'>Password</label>
              <input type='password' className='form-control' id='password' placeholder='Password' name='password' onChange={handleInputChange} />
            </div>
            
            <p>Already registered? <Link to='/sign-in' style={{ color: '#dc3545', textDecoration: 'none' }}>Sign In</Link></p>
            <div className='text-center'>
              <button type='submit' className='btn btn-danger'>Submit</button>
            </div>
          </form>
          {success && <p>Signup successful!</p>}
          {error && <p>Error: {error}</p>}
        </div>
      </div>
    </div>
  );
}
