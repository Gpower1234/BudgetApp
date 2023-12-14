import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';

export default function UpdateExpense() {
  const {id} = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [expenseData, setExpenseData] = useState({
    item_name: '',
    amount: '',
  })

  const [getData, setGetData] = useState({
    item_name: '',
    amount: '',
  })

  const name = getData.length > 0 ? getData[0].item_name : '';

  const amount = getData.length > 0 ? getData[0].amount : '';
  
  const handleUpdateExpense = (e) => {
    e.preventDefault();

    setIsLoading(true)

    axios.put('http://localhost:5001/update-expense/'+id, expenseData)
    .then(res => {
      if (res.data.status === 'success') {
        setTimeout(() => {
          setIsLoading(false)
          setSuccess('Expense Updated')
        }, 3000)
      } else {
        setIsLoading(false)
        setError('Error updating expense')
      }
    })
  };

  useEffect(() => {
    axios.get('http://localhost:5001/expenseID/'+id)
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
        <h6 style={{ color: '#87ceeb', marginTop: '60px' }}>Previous Value</h6>
        <p style={{ color: '#fff' }}>Name: {name}</p>
        <p style={{ color: '#fff' }}>Amount: {amount}</p>
      </div>
      <div  className='container' style={{ display: 'grid', placeItems: 'center', marginBottom: '50px'}}>
        {isLoading &&
          <div className='col-md-3 col-8' style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '9999'}}>
              <div style={{ display: 'grid', placeItems: 'center'}}>
                {isLoading && <MoonLoader size={30} color={'#001f3f'} />}
                {isLoading && <p style={{ color: '#001f3f'}}>Updating Expenses...</p>}
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
          <div  className='mb-3'>
            <h6 style={{ color: '#001f3f', display: 'flex', justifyContent: 'center' }}>UPDATE EXPENSES</h6>
          </div>

          <form onSubmit={handleUpdateExpense}>
            <div className='mb-3'>
                <input type='text' className='form-control' id='name' placeholder='Name' onChange={e => setExpenseData({...expenseData, item_name: e.target.value})} />
            </div>
            
            <div className='mb-3'>
                <input type='number' className='form-control' id='amount' placeholder='Amount'  onChange={e => setExpenseData({...expenseData, amount: e.target.value})}/>
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