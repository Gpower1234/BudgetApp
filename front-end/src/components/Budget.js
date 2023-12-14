import React from 'react';
import { Link } from 'react-router-dom';

export default function Budget() {
  return (
    <div className='container d-flex justify-content-center align-items-center'>
      <div className='row'>
        <div className='' style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px'}}>
          <h4>Hello </h4>
        </div>

        <div className='mx-auto p-3 offset-sm-3 box-show' style={{ display: 'grid', placeItems: 'center', marginBottom: '50px', backgroundColor: 'beige'}}>
          <h5 style={{fontFamily: 'monospace'}}>CREATE BUDGET</h5>
          <div style={{marginBottom: '20px'}}>
            <button className='btn' style={{color: ''}}>
              <Link to='/create-weekly-budget' style={{textDecoration: 'none', color: '#c82333'}}><h6 style={{fontSize: '12px'}}>Create Weekly Budget</h6></Link>
            </button>
          </div>

          <div style={{marginBottom: '20px'}}>
            <button className='btn'>
              <Link to='/create-monthly-budget' style={{textDecoration: 'none', color: '#c82333'}}><h6 style={{fontSize: '12px'}}>Create Monthly Budget</h6></Link>
            </button>
          </div>
          
          <div>
            <button className='btn btn-danger'>
              <Link to='/create-yearly-budget' style={{textDecoration: 'none', color: 'white'}}><h6 style={{fontSize: '12px'}}>Create Yearly Budget</h6></Link>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', placeItems: 'center'}}>
          <h5>Expenditure</h5>
        </div>
      </div>    
    </div>
  )
}
