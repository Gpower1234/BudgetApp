import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MoonLoader } from 'react-spinners';
//import PieChart from './PieChart'
import { Doughnut, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
//import faker from 'faker';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

export default function BudgetDetail() {
  const {month} = useParams();
  const {year} = useParams();
  const [monthlyBudgetDetail, setMonthlyBudgetDetail] = useState([]);
  const [budgetDetail, setBudgetDetail] = useState([]);
  const [expensesDetail, setExpensesDetail] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [budgetTotal, setBudgetTotal] = useState(0)
  const [items, setItems] = useState([])
  const currency = monthlyBudgetDetail.length > 0 ? monthlyBudgetDetail[0].currency : '';

  const budgetAmounts = budgetDetail.map(item => parseInt(item.est_amount, 10))
  const totalBudgetAmount = budgetAmounts.reduce((total, amount) => total + amount, 0)
  const expensesAmounts = expensesDetail.map(item => parseInt(item.amount, 10))
  const totalExpensesAmount = expensesAmounts.reduce((total, amount) => total + amount, 0)

  const balance = totalBudgetAmount - totalExpensesAmount

  //const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);


  //const expensesPercentage = (expensesAmounts / budgetAmounts) * 100;
  //const balancePecentage  = 100 - expensesPercentage
  

  const [budgetData, setBudgetData] = useState({
    name: '',
    estimated_amount: '',
    symbol: '',
    budget_month: month,
    year: year
  })

  const [expensesData, setExpensesData] = useState({
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
        backgroundColor: ['#36a2eb', '#ff5733'],
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
        backgroundColor: 'purple',
      },
      {
        label: 'Expenses',
        data: [totalExpensesAmount],
        backgroundColor: '#ff5733',
      },
    ]
  }

  const [isOpen, setIsOpen] = useState(false)
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

    {/*const formdata = new FormData();
    formdata.append('name', data.name);
    formdata.append('estimated_amount', data.estimated_amount);
  formdata.append('budget_month', data.budget_month); */}
    axios.post('http://localhost:5001/add-budget', dataToSend)
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
        })
        setError('Error adding budget')
      }
    }).catch(err => {'Error in server'})
  }


  const handleAddExpenses = (e) => {
    e.preventDefault();

    const dataToSend = {...expensesData, symbol: currency}

    setIsLoading(true)

    {/*const formdata = new FormData();
    formdata.append('name', data.name);
    formdata.append('estimated_amount', data.estimated_amount);
  formdata.append('budget_month', data.budget_month); */}
    axios.post('http://localhost:5001/add-expenses', dataToSend)
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
        })
        setError('Error adding expenses')
      }
    }).catch(err => {'Error in server'})
  }

  
  useEffect(() => {
    axios.get('http://localhost:5001/budget/'+month+'/'+year)
    .then(res => {
      if (res.data.status === 'success') {
        setBudgetDetail(res.data.Result)
      } if (res.data.status === 'Error') {
        setError(res.data.Error)
      }
    }).catch(err => {'Error fetching data'});

    axios.get('http://localhost:5001/expenses/'+month+'/'+year)
    .then(res => {
      if (res.data.status === 'success') {
        setExpensesDetail(res.data.Result)
      } if (res.data.status === 'Error') {
        setError(res.data.Error)
      }
    }).catch(err => {'Error fetching data'});

    axios.get('http://localhost:5001/monthly-budget/'+month+'/'+year)
    .then(res => {
      if (res.data.status === 'success') {
        setMonthlyBudgetDetail(res.data.Result)
      } if (res.data.status === 'Error') {
        setError(res.data.Error)
      }
    }).catch(err => {'Error fetching data'})
  }, [])

  

  return (
    <div style={{ position: 'relative', background: 'linear-gradient(to bottom, #001f3f, #000)', height: '300vh' }}>
      {isLoading &&
        <div className='col-md-3 col-8' style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '9999'}}>
          <div style={{ display: 'grid', placeItems: 'center' }}>
            {isLoading && <MoonLoader size={30} color={'#001f3f'} />}
            {isLoading && <p style={{ color: '#001f3f'}}>Adding...</p>}
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

      <div style={{ display: 'flex', justifyContent: 'center'}}>
        <h4 style={{fontFamily: 'monospace', color: '#87ceeb', marginTop: '100px'}}>{month}-{year} BUDGETS/EXPENSES</h4>
      </div>

      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div style={{width: '200px', height: '200px', color: '#fff'}}>
          <Doughnut options={doughnutOption} data={doughnutChartData} style={{ color: '#fff' }} />
          <p style={{ fontSize: '10px', display: 'flex', justifyContent: 'center'}}>Expenses Total Amount: {currency} {totalExpensesAmount}</p>
          <p style={{ fontSize: '10px', display: 'flex', justifyContent: 'center'}}>Balance: {currency} {balance}</p>
        </div>

        <div style={{width: '300px', height: '300px', color: '#fff'}}>
          <Bar options={option} data={barChartData} />
          <p style={{ fontSize: '10px', display: 'flex', justifyContent: 'center'}}>Budget Total Amount: {currency} {totalBudgetAmount}</p>
          <p style={{ fontSize: '10px', display: 'flex', justifyContent: 'center'}}>Expenses Total Amount: {currency} {totalExpensesAmount}</p>
        </div>
      </div>

      <div className='container'>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <h5 style={{fontFamily: 'monospace', color: '#87ceeb'}}>BUDGETS</h5>

          <table className='table table-responsive table-bordered'>
            <thead>
              <tr className='col-lg' style={{ fontSize: '12px'}}>
                <th style={{ backgroundColor: '#001f3f', color: '#fff' }}>Name</th>
                <th style={{ backgroundColor: '#001f3f', color: '#fff' }}>Est. Amount</th>
                <th style={{ backgroundColor: '#001f3f', color: '#fff' }}> Edit</th>
                <th style={{ backgroundColor: '#001f3f', color: '#fff' }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {budgetDetail.map((budget, index) => {
                return <tr key={index}>
                    <td style={{ fontSize: '12px', backgroundColor: '#87ceeb' }}>{budget.name}</td>
                    <td style={{ fontSize: '12px', backgroundColor: '#87ceeb'}}>{currency} {budget.est_amount}</td>
                    <td style={{ backgroundColor: '#87ceeb' }}>
                      <Link to={'/update-budget/' + budget.id} style={{ fontSize: '12px', color: 'blue', textDecoration: 'none', cursor: 'pointer'}}>Edit</Link>
                    </td>
                    <td style={{ backgroundColor: '#87ceeb' }}>
                      <Link to={'/delete-budget/' + budget.id} style={{ fontSize: '12px', textDecoration: 'none', cursor: 'pointer', color: 'red'}}>Delete</Link>
                    </td>
                </tr>
              })}
              <tr style={{ color: '#87ceeb', fontSize: '14px'}}>
                <td style={{ backgroundColor: '#87ceeb' }}>Total:</td>
                <td style={{ backgroundColor: '#87ceeb' }}>{currency} {totalBudgetAmount}</td>
                <td style={{ backgroundColor: '#87ceeb' }}></td>
                <td style={{ backgroundColor: '#87ceeb' }}></td>
              </tr>
              
            </tbody>
          </table>
        </div>
      </div>
      
      <div className='container' style={{ display: 'grid', placeItems: 'center', marginBottom: '50px'}}>
          <p style={{ color: '#fff' }}>Propose budget can be added here. The propose budget doesn't neccessarily mean it will be executed, this is neccessary during planning phase of your budgets</p>
          <button onClick={handleClick1} className='btn btn-lg btn-primary' style={{display: 'grid', placeItems: 'center', marginBottom: '20px', fontSize: '12px' }}>Add Budget</button>
          <div style={{marginBottom: '20px'}}>
          
            {showBudgetForm && (
              <div className=''>
                <form onSubmit={handleAddBudget}>
                    <div className='mb-3'>
                        <input style={{ backgroundColor: '#87ceeb' }} type='text' className='form-control form-control-sm' id='name' placeholder='Item Name' onChange={e => setBudgetData({...budgetData, name: e.target.value})}/>
                    </div>
                    
                    <div className='mb-3'>
                      <input style={{ backgroundColor: '#87ceeb' }} type='number' className='form-control form-control-sm' id='amount' placeholder={'Estimated amount' + ' ' + currency} onChange={e => setBudgetData({...budgetData, estimated_amount: e.target.value})}/>
                    </div>

                    <div className='text-center'>
                        <button type='submit' className='btn btn-sm btn-primary'>Add</button>
                    </div>
                </form>
              </div>
            )}
          </div>
      </div>
      <div>
        <div className='container'>
          <div style={{ display: 'flex', justifyContent: 'center'}}>
              <h5 style={{fontFamily: 'monospace', color: '#87ceeb' }}>EXPENSES</h5>
          </div>
          <table className='table table-responsive table-bordered'>
            <thead style={{ backgroundColor: '#444' }}>
              <tr>
                <th className='col-lg' style={{ backgroundColor: '#001f3f', color: '#fff', fontSize: '12px'}}>Item Name</th>
                <th className='col-lg' style={{ backgroundColor: '#001f3f', color: '#fff', fontSize: '12px'}}>Amount</th>
                <th className='col-lg' style={{ backgroundColor: '#001f3f', color: '#fff', fontSize: '12px' }}>Edit</th>
                <th className='col-lg' style={{ backgroundColor: '#001f3f', color: '#fff', fontSize: '12px' }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {expensesDetail.map((expenses, index) => {
                return <tr key={index}>
                    <td style={{ fontSize: '12px', backgroundColor: '#87ceeb' }}>{expenses.item_name}</td>
                    <td style={{ fontSize: '12px', backgroundColor: '#87ceeb' }}>{currency}{expenses.amount}</td>
                    <td style={{ backgroundColor: '#87ceeb' }}>
                      <Link to={'/update-expense/' + expenses.id} style={{ fontSize: '12px', textDecoration: 'none', cursor: 'pointer', color: '#00f'}}>Edit</Link>
                    </td>
                    <td style={{ backgroundColor: '#87ceeb' }}>
                      <Link to={'/delete-expense/' + expenses.id} style={{ fontSize: '12px', textDecoration: 'none', cursor: 'pointer', color: 'red'}}>Delete</Link>
                    </td>
                </tr>
              })}
              <tr>
                <td style={{ backgroundColor: '#87ceeb', fontSize: '14px'}}>Total:</td>
                <td style={{ backgroundColor: '#87ceeb', fontSize: '14px'}}>{currency}{totalExpensesAmount}</td>
                <td style={{ backgroundColor: '#87ceeb' }}></td>
                <td style={{ backgroundColor: '#87ceeb' }}></td>
              </tr>
            </tbody>
          </table>
        </div>


        <div className='container' style={{ display: 'grid', placeItems: 'center', marginBottom: '50px'}}>
          
        <p className='text-start' style={{ color: '#fff' }}>Add Expenses for {month} budget</p>

        <button onClick={handleClick2} className='btn btn-lg btn-primary' style={{display: 'grid', placeItems: 'center', marginBottom: '20px', fontSize: '12px'}}>Add Expenses</button>
          
          <div style={{marginBottom: '20px'}}>
            
            {showExpenseForm && (
              <form onSubmit={handleAddExpenses}>
                <div className='mb-3'>
                    <input style={{ backgroundColor: '#87ceeb' }} type='text' className='form-control form-control-sm' id='name' placeholder='Item Name' onChange={e => setExpensesData({...expensesData, name: e.target.value})} />
                </div>
                
                <div className='mb-3'>
                    <input style={{ backgroundColor: '#87ceeb' }} type='number' className='form-control form-control-sm' id='amount' placeholder={'Amount Spent' + ' ' + currency} onChange={e => setExpensesData({...expensesData, amount: e.target.value})}/>
                </div>

                <div className='text-center'>
                    <button type='submit' className='btn btn-sm btn-primary'>Add</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
