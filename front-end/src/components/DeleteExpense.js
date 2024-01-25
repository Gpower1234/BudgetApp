import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';

export default function DeleteExpense() {
    const {id} = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [getData, setGetData] = useState('')
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(true);

    const month = getData.length > 0 ? getData[0].month: '';

    const year = getData.length > 0 ? getData[0].year: '';

    const navigate = useNavigate();

    const handleCancelDelete = () => {
        navigate('/budget-detail/' + month + '/' + year)
    }

    const handleConfirmDelete = () => {
    
        setIsLoading(true)

        setShowDeleteConfirmation(false)
    
        axios.delete('http://localhost:5001/expense-delete/'+id)
        .then(res => {
          if (res.data.status === 'success') {
            setTimeout(() => {
              setIsLoading(false)
              setSuccess('Expense deleted')
              setTimeout(() => {
                navigate('/budget-detail/' + month + '/' + year)
              }, 1000)
            }, 3000)
          } else {
            setIsLoading(false)
            setError('Delete failed')
          }
        })
      }

      useEffect(() => {
        axios.get('http://localhost:5001/expenseID/'+id)
        .then(res => {
          if (res.data.status === 'success') {
            return setGetData(res.data.Result)
          } if (res.data.status === 'Error') {
            setError('SERVER ERROR')
            setTimeout(() => {
              navigate('/budget-detail/' + month + '/' + year)
            }, 3000)
          } if (res.data.status === 'null') {
              return setError('No expenditure with such ID found for this user')
          } else {
            setError('SERVER ERROR')
            setTimeout(() => {
              navigate('/budget-detail/' + month + '/' + year)
            }, 3000)
          }
        }).catch(err => {'Error fetching data'})
      }, [])
  return (
    <div style={{ position: 'relative', background: 'linear-gradient(to bottom, #001f3f, #000)', height: '100vh' }}>
        {isLoading &&
          <div className='col-md-3 col-8' style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '9999'}}>
              <div style={{ display: 'grid', placeItems: 'center'}}>
                {isLoading && <MoonLoader size={30} color={'#001f3f'} />}
                {isLoading && <p style={{ color: '#001f3f'}}>Deleting Expenses...</p>}
              </div>
          </div>
        }

        {success && 
          <div className='alert alert-success alert-dismissible fade show' style={{position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', zIndex: '9999'}}>
            {success && <p className='text-center' style={{ color: '#001f3f', fontWeight: 'bold' }}>{success}</p>}
            {/*<button type='button' className='btn-close' data-bs-dismiss='alert'></button>*/}
          </div>
        }

        {error && 
            <div className='alert alert-danger alert-dismissible fade show' style={{position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', zIndex: '9999'}}>
            {error && <p className='text-center' style={{ color: '#f00', fontWeight: 'bold' }}>{error}</p>}
            {/*<button type='button' className='btn-close' data-bs-dismiss='alert'></button>*/}
            </div>
        }

        {showDeleteConfirmation && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', background: 'linear-gradient(to bottom, #001f3f, #000)' }}>
          <div style={{ backgroundColor: '#87ceeb', padding: '20px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3', textAlign: 'center'}}>
            <p>Are you sure you want to delete this Expense</p>
            <button onClick={handleConfirmDelete} className='btn btn-primary' style={{ fontSize: '10px', color: '#fff', marginRight: '5px' }}>Yes</button>
            <button onClick={handleCancelDelete} className='btn btn-danger' style={{ fontSize: '10px' }}>No</button>
          </div>
        </div>
       )}
    </div>
  )
}
