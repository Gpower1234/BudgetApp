import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';

export default function UpdateBudget() {
  const {id} = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [budgetData, setBudgetData] = useState({
    name: '',
    estimated_amount: '',
  })

  const [getData, setGetData] = useState({
    name: '',
    estimated_amount: '',
  })

  const name = getData.length > 0 ? getData[0].name : '';

  const estimated_amount = getData.length > 0 ? getData[0].est_amount : '';
  
  const handleUpdateBudget = (e) => {
    e.preventDefault();

    setIsLoading(true)

    axios.put('http://localhost:5001/update-budget/'+id, budgetData)
    .then(res => {
      console.log(getData)
      if (res.data.status === 'success') {
        setTimeout(() => {
          setIsLoading(false)
          setSuccess('Budget Updated')
        }, 3000)
      } else {
        setIsLoading(false)
        setError('Error updating budget')
      }
    })
  };

  useEffect(() => {
    axios.get('http://localhost:5001/budgetID/'+id)
    .then(res => {
      if (res.data.status === 'success') {
        setGetData(res.data.Result)
      } if (res.data.status === 'Error') {
        setError(res.data.Error)
      }
    }).catch(err => {'Error fetching data'})
  }, [])

  return (
    <div style={{ position: 'relative', background: 'linear-gradient(to bottom, #001f3f, #000)', height: '100vh'}}>
      <div className='container' style={{ display: 'grid', placeItems: 'center', marginBottom: '50px'}}>
        <h6 style={{ color: '#87ceeb', marginTop: '60px'}}>Previous Value</h6>
        <p style={{ color: '#fff' }}>Budget Name: {name}</p>
        <p style={{ color: '#fff' }}>Amount: {estimated_amount}</p>
      </div>
      
      <div  className='container' style={{ display: 'grid', placeItems: 'center', marginBottom: '50px'}}>
        {isLoading &&
          <div className='col-md-3 col-8' style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '9999'}}>
              <div style={{ display: 'grid', placeItems: 'center'}}>
                {isLoading && <MoonLoader size={30} color={'#001f3f'} />}
                {isLoading && <p style={{ color: '#001f3f'}}>Updating Budget...</p>}
              </div>
          </div>
        }

        {success && 
          <div className='alert alert-success alert-dismissible fade show'>
            {success && <p className='text-success text-center'>{success}</p>}
            {/*<button type='button' className='btn-close' data-bs-dismiss='alert'></button>*/}
          </div>
        }

        {error && 
          <div className='alert alert-danger alert-dismissible fade show'>
            {error && <p className='text-danger text-center'>{error}</p>}
            {/*<button type='button' className='btn-close' data-bs-dismiss='alert'></button>*/}
          </div>
        }

        <div className='col-md-3 col-8' style={{ backgroundColor: '#87ceeb', padding: '15px', borderRadius: '15px', marginTop: '50px'}}>
          <div className='mb-3'>
            <h6  style={{ color: '#001f3f', display: 'flex', justifyContent: 'center' }}>UPDATE BUDGET</h6>
          </div>

          <form onSubmit={handleUpdateBudget}>
            <div className='mb-3'>
                <input type='text' className='form-control' id='name' placeholder='Name' onChange={e => setBudgetData({...budgetData, name: e.target.value})} />
            </div>
            
            <div className='mb-3'>
                <input type='number' className='form-control' id='amount' placeholder='Amount'  onChange={e => setBudgetData({...budgetData, estimated_amount: e.target.value})}/>
            </div>

            <div className='text-center'>
                <button type='submit' className='btn btn-primary'>Submit</button>
            </div>
          </form>

        </div>

        


        

      </div>
    </div>
  )
}
