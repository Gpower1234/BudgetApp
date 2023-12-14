import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import backgroundImage from '../images/image9.jpg';
import '../CSS/home.css';

export const Home = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const successMessage = query.get('message');

  const pageStyle = {
    backgroundImage: `url(${backgroundImage})`,
    //backgroundColor: 'rgba(255, 255, 255, 0.5)',
    filter: 'blur(2px)',
    backGroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
  }

  return (
    <div className='dashboard-container'>
      <div style={{ display: 'grid', placeItems: 'center'}}>
      {successMessage &&
        <div className='alert alert-success alert-dismissible fade show'>
           <p style={{ color: 'green' }}>{successMessage}</p>
          <button type='button' className='btn-close' data-bs-dismiss='alert'></button>
        </div>
      } 
        <h6>Welcome user</h6>
        <section>
          <p>Planning how we spend our income by allocating funds to every expenses prior to the time of execution is what most people desire.</p>
        </section>
      </div> 
    </div>
  )
}
