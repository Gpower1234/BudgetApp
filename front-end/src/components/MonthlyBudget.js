import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
//import '../CSS/MonthlyBudget.css';

export default function MonthlyBudget() {
  const [data, setData] = useState([]);
  console.log(data)
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const successMessage = query.get('message')

  useEffect(() => {
    axios.get('http://localhost:5001/monthly-budget')
    .then(res => {
      if (res.data.status === 'success') {
        setData(res.data.Result)
        //console.log(setData)
      } if (res.data.Error) {
        console.log(Error)
      } 
    }).catch(err => {'Error fetching data'})
  }, [])
  return (
    <div style={{ position: 'relative', background: 'linear-gradient(to bottom, #001f3f, #000)', height: '100vh'}}>
      {successMessage && 
      <div className='alert alert-success alert-dismissible fade show text-center'>
        <p style={{ color: 'green' }}>{successMessage}</p>
        <button type='button' className='btn-close' data-bs-dismiss='alert'></button>
      </div>
      }
      <div className='table-responsive'>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center'}}>
          <h5 style={{fontFamily: 'monospace', color: '#fff', fontWeight: 'bold', margin: '0 0 50px 0'}}>BUDGETS</h5>
          <table style={{ borderCollapse: 'separate', borderSpacing: '15px'}}>
            <thead>
              <tr style={{ color: '#87ceeb'}}>
                <th className='col-sm'>YEAR</th>
                <th className='col-sm'>MONTH</th>
                <th className='col-sm' >DETAILS</th>
              </tr>
            </thead>
            <tbody style={{ color: '#aaa' }}>
              {data.map((budget, index) => {
                return <tr key={index}>
                    <td>{budget.year}</td>
                    <td>{budget.month}</td>
                    <td>
                      <Link to={'/budget-detail/' + budget.month + '/' + budget.year} style={{textDecoration: 'none', color: '#87ceeb'}}>view more</Link>
                    </td>
                </tr>
              })}
              
            </tbody>
        
        </table>
      
        </div>
        
    </div> 
    </div>
    
  )
}
