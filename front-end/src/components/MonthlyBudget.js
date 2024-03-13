import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

export default function MonthlyBudget() {
  const [data, setData] = useState([]);
  const [visibleItems, setVisibleItems] = useState(10)
  //const location = useLocation();
  //const query = new URLSearchParams(location.search);
  //const successMessage = query.get('message')


  const loadMoreData = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems + 10);
  }

  useEffect(() => {
    axios.get('http://localhost:5001/monthly-budgets')
    .then(res => {
      if (res.data.status === 'success') {
        setData(res.data.Result)
      } if (res.data.Error) {
        console.log(Error)
      } 
    }).catch(err => {'Error fetching data'})
  }, [])
  return (
    <div style={{ background: 'linear-gradient(to bottom, #001f3f, #000)'}}>
      {/*{successMessage && 
      <div className='alert alert-success alert-dismissible fade show text-center'>
        <p style={{ color: 'green' }}>{successMessage}</p>
        <button type='button' className='btn-close' data-bs-dismiss='alert'></button>
      </div>
      }*/}
      <div className='container'>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px', paddingBottom: '5px', height: '100vh'}}>
          <h5 style={{fontFamily: 'monospace', color: '#fff', fontWeight: 'bold', margin: '0 0 50px 0'}}>BUDGETS</h5>
          <table className='table table responsive' style={{ borderCollapse: 'separate', borderSpacing: '15px'}}>
            <thead>
              <tr style={{ color: '#87ceeb'}}>
                <th className='col-lg' style={{ fontSize: '12px'}}>YEAR</th>
                <th className='col-lg' style={{ fontSize: '12px'}}>MONTH</th>
                <th className='col-lg' style={{ fontSize: '12px'}} >DETAILS</th>
              </tr>
            </thead>
            <tbody style={{ color: '#aaa' }}>
              {data.slice(0, visibleItems).map((budget, index) => {
                return <tr key={index}>
                    <td>{budget.year}</td>
                    <td>{budget.month}</td>
                    <td>
                      <Link to={'/budget-detail/' + budget.month + '/' + budget.year} style={{textDecoration: 'none', color: '#00f'}}>view more</Link>
                    </td>
                </tr>
              })}
              
            </tbody>
        
        </table>
        {visibleItems < data.length && (
          <button onClick={loadMoreData} className='btn' style={{ backgroundColor: '#fff', fontSize: '12px', fontWeight: 'bold'}}>Load More</button>
        )}
      
        </div>
        
    </div> 
    </div>
    
  )
}
