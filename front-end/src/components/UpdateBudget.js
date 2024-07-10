import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();

  const name = getData.length > 0 ? getData[0].name : '';

  const estimated_amount = getData.length > 0 ? getData[0].est_amount : '';
  
  const handleUpdateBudget = (e) => {
    e.preventDefault();

    setIsLoading(true)

    axios.put(process.env.REACT_APP_API_URL + '/update-budget/'+id, budgetData)
    .then(res => {
      if (res.data.status === 'success') {
        setTimeout(() => {
          setIsLoading(false)
          setSuccess('Budget Updated')
          setTimeout(() => {
            navigate('/')
          }, 3000)
        }, 3000)
        
      } else {
        setIsLoading(false)
        setTimeout(() => {
          setIsLoading(false)
          setError('Error updating budget')
          setTimeout(() => {
            navigate('/')
          }, 3000)
        }, 3000)
      }
    })
  };

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + '/budgetID/'+id)
    .then(res => {
      if (res.data.status === 'success') {
        return setGetData(res.data.Result)
      } if (res.data.status === 'Error') {
        setError('SERVER ERROR! Redirecting...')
        setTimeout(() => {
          navigate('/')
        }, 3000)
      } if (res.data.status === 'null' ) {
        return setError('No budget with such ID found for this user')
      } else {
        setError('SERVER ERROR! Redirecting...')
        setTimeout(() => {
          navigate('/')
        }, 3000)
      }
    }).catch(err => {'Error fetching data'})
  }, [id, navigate])

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
          <div style={{position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', zIndex: '9999'}}>
            {success && <p className='text-center'  style={{ color: '#001f3f', fontWeight: 'bold' }}>{success}</p>}
          </div>
        }

        {error && 
          <div style={{position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', zIndex: '9999'}}>
            {error && <p className='text-danger text-center'>{error}</p>}
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
