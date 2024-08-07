import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MoonLoader } from 'react-spinners';
//import PieChart from './PieChart'
import { Doughnut, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from './AuthContext';
//import faker from 'faker';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

export default function BudgetDetail() {
  const {month, year} = useParams();
  const { user } = useAuth();
  const [visibleBudgets, setVisibleBudgets] = useState(10)
  const [visibleExpenses, setVisibleExpenses] = useState(10)
  const [monthlyBudgetDetail, setMonthlyBudgetDetail] = useState([]);
  const [budgetDetail, setBudgetDetail] = useState([]);
  const [expensesDetail, setExpensesDetail] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const currency = monthlyBudgetDetail.length > 0 ? monthlyBudgetDetail[0].currency : '';
  const budgetAmounts = budgetDetail.map(item => parseInt(item.est_amount, 10))
  const totalBudgetAmount = budgetAmounts.reduce((total, amount) => total + amount, 0)
  const expensesAmounts = expensesDetail.map(item => parseInt(item.amount, 10))
  const totalExpensesAmount = expensesAmounts.reduce((total, amount) => total + amount, 0)

  const balance = totalBudgetAmount - totalExpensesAmount

  const monthNumber = new Date(`${month} 1, 2000`).getMonth();

  const nextMonthNumber = (monthNumber + 1) % 12;

  const nextMonth = new Date(2000, nextMonthNumber, 1).toLocaleString('default', { month: 'long' });

  // Check if next month is January
  const shouldIncreaseYear = nextMonthNumber === 0;

  // Calculate the new year
  const nextYear = shouldIncreaseYear ? parseInt(year, 10) + 1 : year;

  const currentDate = new Date();
  
  const targetDate = new Date(`${nextYear}-${nextMonth}-1`)

  const showButtons = currentDate <= targetDate

  const loadMoreBudgets = () => {
    setVisibleBudgets(prevVisibleBudgets => prevVisibleBudgets + 10);
  };

  const loadMoreExpenses = () => {
    setVisibleExpenses(prevVisibleExpenses => prevVisibleExpenses + 10);
  };
  
  const [budgetData, setBudgetData] = useState({
    user: user.email,
    name: '',
    estimated_amount: '',
    symbol: '',
    budget_month: month,
    year: year
  })

  const [expensesData, setExpensesData] = useState({
    user: user.email,
    item_name: '',
    amount: '',
    symbol: '',
    expenses_month: month,
    year: year
  })
  

  const doughnutOption = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff'
        }
      },
      title: {
        display: true,
        text: 'Expenses/Balance Chart',
        color: '#fff'
      },
    },
  };

  const doughnutChartData = {
    labels: ['Balance', 'Expenses'],
    datasets: [
      {
        data: [balance, totalExpensesAmount],
        backgroundColor: ['#ff5733', 'wheat'],
        //borderColor: ['yellow'],
        justifyContent: 'center',
        borderWidth: 1,
      }
    ]
  }
  
  const option = {
    responsive: true,

    scales: {
      x: {
        ticks: {
          color: '#fff'
        }, 
        grid: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
      y: {
        ticks: {
          color: '#fff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      }
    },
   
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff'
        },
      },

      title: {
        display: true,
        text: 'Expenses/Budget Chart',
        color: '#fff' 
      },
    },
  };

  const barChartData = {
    labels: [month],
    datasets: [
      {
        label: 'Budget',
        data: [totalBudgetAmount],
        backgroundColor: 'lime',
      },
      {
        label: 'Expenses',
        data: [totalExpensesAmount],
        backgroundColor: 'wheat',
      },
    ]
  }


  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const handleClick1 = () => {
    setShowBudgetForm(!showBudgetForm)
  };

  const handleClick2 = () => {
    setShowExpenseForm(!showExpenseForm)
  }

  const handleAddBudget = (e) => {
    e.preventDefault();

    const dataToSend = {...budgetData, symbol: currency}

    setIsLoading(true)

    axios.post(process.env.REACT_APP_API_URL + '/add-budget', dataToSend)
    .then(res => {
      console.log('Budget Data', dataToSend)
      if (res.data.status === 'success') {
        setTimeout(() => {
          setIsLoading(false)
          setSuccess('Budget Added')
          setTimeout(() => {
            window.location.reload(true)
          }, 1500)
        }, 3000)
      } else {
        setTimeout(() => {
          setIsLoading(false)
          setError('Error adding budget')
          setTimeout(() => {
            window.location.reload(true)
          }, 1500)
        }, 3000)
      }
    }).catch(err => {'Error in server'})
  }


  const handleAddExpenses = (e) => {
    e.preventDefault();

    const dataToSend = {...expensesData, symbol: currency}

    setIsLoading(true)

    axios.post(process.env.REACT_APP_API_URL + '/add-expenses', dataToSend)
    .then(res => {
      if (res.data.status === 'success') {
        setTimeout(() => {
          setIsLoading(false)
          setSuccess('Expenses Added')
          setTimeout(() => {
            window.location.reload(true)
          }, 1500)
        }, 3000)
        
        
      } else {
        setTimeout(() => {
          setIsLoading(false)
          setError('Error adding expenses')
          setTimeout(() => {
            window.location.reload(true)
          }, 1500)
        }, 3000)
      }
    }).catch(err => {'Error in server'})
  }

  
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + '/budget/'+month+'/'+year)
    .then(res => {
      if (res.data.status === 'success') {
        setBudgetDetail(res.data.Result)
      } if (res.data.status === 'Error') {
        setError(res.data.Error)
      }
    }).catch(err => {'Error fetching data'});

    axios.get(process.env.REACT_APP_API_URL + '/expenses/'+month+'/'+year)
    .then(res => {
      if (res.data.status === 'success') {
        setExpensesDetail(res.data.Result)
      } if (res.data.status === 'Error') {
        setError(res.data.Error)
      }
    }).catch(err => {'Error fetching data'});

    axios.get(process.env.REACT_APP_API_URL + '/monthly-budget/'+month+'/'+year)
    .then(res => {
      if (res.data.status === 'success') {
        setMonthlyBudgetDetail(res.data.Result)
      } if (res.data.status === 'Error') {
        setError(res.data.Error)
      }
    }).catch(err => {'Error fetching data'})
  }, [month, year])

  

  return (
    <div style={{ background: 'linear-gradient(to bottom, #001f3f, #000)', paddingBottom: '150px' }}>
      {isLoading &&
        <div className='col-md-3 col-8' style={{position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', zIndex: '9999'}}>
          <div style={{ display: 'grid', placeItems: 'center' }}>
            {isLoading && <MoonLoader size={30} color={'#001f3f'} />}
            {isLoading && <p style={{ color: '#001f3f'}}>Adding...</p>}
          </div>
        </div>
      }

      {success && 
        <div style={{position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', zIndex: '9999'}}>
          {success && <p className='text-center' style={{ color: '#001f3f', fontWeight: 'bold' }}>{success}</p>}
        </div>
      }

      {error && 
        <div style={{position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', zIndex: '9999'}}>
          {error && <p className='text-center' style={{ color: '#f00', fontWeight: 'bold' }}>{error}</p>}
        </div>
      }

      <div style={{ display: 'flex', justifyContent: 'center'}}>
        <h4 style={{fontFamily: 'monospace', color: '#87ceeb', marginTop: '100px'}}>{month}-{year} BUDGETS/EXPENSES</h4>
      </div>

      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div style={{width: '200px', height: '200px', color: '#fff'}}>
          <Doughnut options={doughnutOption} data={doughnutChartData} style={{ color: '#fff' }} />
          <p style={{ fontSize: '12px', display: 'flex', justifyContent: 'center'}}>Expenses Total Amount: {currency} {totalExpensesAmount}</p>
          <p style={{ fontSize: '12px', display: 'flex', justifyContent: 'center'}}>Balance: {currency} {balance}</p>
        </div>

        <div style={{width: '300px', height: '300px', color: '#fff'}}>
          <Bar options={option} data={barChartData} />
          <p style={{ fontSize: '12px', display: 'flex', justifyContent: 'center'}}>Budget Total Amount: {currency} {totalBudgetAmount}</p>
          <p style={{ fontSize: '12px', display: 'flex', justifyContent: 'center'}}>Expenses Total Amount: {currency} {totalExpensesAmount}</p>
        </div>
      </div>

      <div className='container'>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '50px'}}>
          <h5 style={{fontFamily: 'monospace', color: '#87ceeb'}}>BUDGETS</h5>

          <table className='table table-responsive table-bordered'>
            <thead>
              <tr className='col-lg' style={{ fontSize: '12px'}}>
                <th style={{ backgroundColor: '#001f3f', color: '#fff' }}>Name</th>
                <th style={{ backgroundColor: '#001f3f', color: '#fff' }}>Est. Amount</th>
                {showButtons && (<th style={{ backgroundColor: '#001f3f', color: '#fff' }}>Update</th>)}
                {showButtons && (<th style={{ backgroundColor: '#001f3f', color: '#fff' }}>Delete</th>)}
              </tr>
            </thead>
            <tbody>
              {budgetDetail.slice(0, visibleBudgets).map((budget, index) => {
                return <tr key={index}>
                    <td style={{ fontSize: '16px', backgroundColor: '#87ceeb' }}>{budget.name}</td>
                    <td style={{ fontSize: '16px', backgroundColor: '#87ceeb'}}>{currency} {budget.est_amount}</td>
                    
                    {showButtons && (
                    <td style={{ backgroundColor: '#87ceeb' }}>
                      <Link to={'/update-budget/' + budget.id} style={{ fontSize: '12px', fontWeight: 'bold', color: 'blue', textDecoration: 'none', cursor: 'pointer'}}>update</Link>
                    </td>
                    )}
                    
                    
                    {showButtons && (
                    <td style={{ backgroundColor: '#87ceeb' }}>
                      <Link to={'/delete-budget/' + budget.id} style={{ fontSize: '12px', fontWeight: 'bold', color: 'red', textDecoration: 'none', cursor: 'pointer'}}>delete</Link>
                    </td>
                    )}
                </tr>
              })}
              <tr style={{ color: '#87ceeb', fontSize: '16px', fontWeight: 'bold'}}>
                <td style={{ backgroundColor: '#87ceeb' }}>Total:</td>
                <td style={{ backgroundColor: '#87ceeb' }}>{currency} {totalBudgetAmount}</td>
                {showButtons && (
                  <td style={{ backgroundColor: '#87ceeb' }}></td>
                )}
                {showButtons && (
                  <td style={{ backgroundColor: '#87ceeb' }}></td>
                )}
              </tr>
              
            </tbody>
          </table>
          {visibleBudgets < budgetDetail.length && (
            <button onClick={loadMoreBudgets} className='btn' style={{ backgroundColor: '#87ceeb', fontSize: '12px', fontWeight: 'bold'}}>Load More</button>
          )}
        </div>
      </div>
      
      <div className='container' style={{ display: 'grid', placeItems: 'center', marginBottom: '50px'}}>
          <p style={{ color: '#fff' }}>Propose budget can be added here. The propose budget doesn't neccessarily mean it will be executed, this is neccessary during planning phase of your budgets</p>
          {showButtons && (
            <button onClick={handleClick1} className='btn btn-lg btn-primary' style={{display: 'grid', placeItems: 'center', marginBottom: '20px', fontSize: '12px' }}>Add Budget</button>
          )}

          {showButtons && (
          <div style={{marginBottom: '20px'}}>
          
            {showBudgetForm && (
              <div className=''>
                <form onSubmit={handleAddBudget}>
                    <div className='mb-3'>
                        <input style={{ backgroundColor: '#87ceeb' }} type='text' className='form-control form-control-sm' id='name' placeholder='Item Name' onChange={e => setBudgetData({...budgetData, name: e.target.value})}/>
                    </div>
                    
                    <div className='mb-3'>
                      <input style={{ backgroundColor: '#87ceeb' }} type='number' className='form-control form-control-sm' id='amount' placeholder={`Estimated amount ${currency}`} onChange={e => setBudgetData({...budgetData, estimated_amount: e.target.value})}/>
                    </div>

                    <div className='text-center'>
                      <button type='submit' className='btn btn-sm' style={{ backgroundColor: '#87ceeb', color: '#001f3f', fontWeight: 'bold' }}>Add</button>
                    </div>
                </form>
              </div>
            )}
          </div>
          )}
      </div>
      <div>
        <div className='container'>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '50px'}}>
              <h5 style={{fontFamily: 'monospace', color: '#87ceeb' }}>EXPENSES</h5>
          
            <table className='table table-responsive table-bordered'>
            <thead>
              <tr className='col-lg' style={{ fontSize: '12px'}}>
                <th style={{ backgroundColor: '#001f3f', color: '#fff' }}>Name</th>
                <th style={{ backgroundColor: '#001f3f', color: '#fff' }}>Amount</th>
                {showButtons && (<th style={{ backgroundColor: '#001f3f', color: '#fff' }}>Update</th>)}
                {showButtons && (<th style={{ backgroundColor: '#001f3f', color: '#fff' }}>Delete</th>)}
              </tr>
            </thead>
              <tbody>
                {expensesDetail.slice(0, visibleExpenses).map((expenses, index) => {
                  return <tr key={index}>
                      <td style={{ fontSize: '16px', backgroundColor: '#87ceeb' }}>{expenses.item_name}</td>
                      <td style={{ fontSize: '16px', backgroundColor: '#87ceeb' }}>{currency}{expenses.amount}</td>
                      {showButtons && (
                        <td style={{ backgroundColor: '#87ceeb' }}>
                         <Link to={'/update-expense/' + expenses.id} style={{ fontSize: '12px', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer', color: '#00f'}}>update</Link>
                       </td>
                      )}

                      {showButtons && (
                        <td style={{ backgroundColor: '#87ceeb' }}>
                          <Link to={'/delete-expense/' + expenses.id} style={{ fontSize: '12px', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer', color: 'red'}}>delete</Link>
                        </td>
                      )}
                      
                  </tr>
                })}
                <tr>
                  <td style={{ backgroundColor: '#87ceeb', fontSize: '16px', fontWeight: 'bold',}}>Total:</td>
                  <td style={{ backgroundColor: '#87ceeb', fontSize: '16px', fontWeight: 'bold'}}>{currency}{totalExpensesAmount}</td>
                  {showButtons && (
                    <td style={{ backgroundColor: '#87ceeb' }}></td>
                  )}
                  {showButtons && (
                    <td style={{ backgroundColor: '#87ceeb' }}></td>
                  )}
                </tr>
              </tbody>
            </table>
            {visibleExpenses < expensesDetail.length && (
              <button onClick={loadMoreExpenses} className='btn' style={{ backgroundColor: '#87ceeb', fontSize: '12px', fontWeight: 'bold'}}>Load More</button>
            )}
          </div>
        </div>


        <div className='container' style={{ display: 'grid', placeItems: 'center', marginBottom: '50px'}}>
          
        <p className='text-start' style={{ color: '#fff' }}>Add Expenses for {month} budget</p>

        {showButtons && (
          <button onClick={handleClick2} className='btn btn-lg btn-primary' style={{display: 'grid', placeItems: 'center', marginBottom: '20px', fontSize: '12px'}}>Add Expenses</button>
        )}
          
          <div style={{marginBottom: '20px'}}>
            
            {showExpenseForm && (
              <form onSubmit={handleAddExpenses}>
                <div className='mb-3'>
                    <input style={{ backgroundColor: '#87ceeb' }} type='text' className='form-control form-control-sm' id='name' placeholder='Item Name' onChange={e => setExpensesData({...expensesData, name: e.target.value})} />
                </div>
                
                <div className='mb-3'>
                    <input style={{ backgroundColor: '#87ceeb' }} type='number' className='form-control form-control-sm' id='amount' placeholder={`Amount Spent ${currency}`} onChange={e => setExpensesData({...expensesData, amount: e.target.value})}/>
                </div>

                <div className='text-center'>
                  {showButtons && (<button type='submit' className='btn btn-sm' style={{ backgroundColor: '#87ceeb', color: '#001f3f', fontWeight: 'bold' }}>Add</button>)}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
