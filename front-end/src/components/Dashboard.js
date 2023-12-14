import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import '../CSS/Dashboard.css';
import '../CSS/home.css';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import { Bar } from 'react-chartjs-2';
//import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)
//import { getUsers } from '../API/apiCalls';

//const BASE_API_URL = "http://localhost:5000";

export const Dashboard = () => {

  const [budget, setBudget] = useState([])
  const [expenses, setExpenses] = useState([])
  const [ error, setError] = useState('')
  //const [chartData, setChartData] = useState([])
  const [dataFetched, setDataFetched] = useState(false);


  const currency = budget.length > 0 ? budget[0].currency : '';

  useEffect(() => {
    axios.get('http://localhost:5001/budget')
    .then(res => {
      console.log('useEffect initiated')
      if (res.data.status === 'success') {
        setBudget(res.data.Result)
        setDataFetched(true)
        //console.log(setData)
      } if (res.data.Error) {
        console.log(Error)
      } 
    }).catch(err => {'Error fetching data'})

    axios.get('http://localhost:5001/expenses')
    .then(res => {
      if (res.data.status === 'success') {
        setExpenses(res.data.Result)
        setDataFetched(true)
        //console.log(setData)
      } if (res.data.Error) {
        console.log(Error)
      } 
    }).catch(err => {'Error fetching data'})

    
  }, []);

  const groupBudgetData = () => {
    const groupedBudgetData = {};

    budget.forEach(item => {
      const key = `${item.month}-${item.year}`

      if (!groupedBudgetData[key]) {
        groupedBudgetData[key] = [];
      }

      groupedBudgetData[key].push(item);
    })

    return groupedBudgetData;
  };

  const groupExpensesData = () => {
    const groupedExpensesData = {};

    expenses.forEach(item => {
      const key = `${item.month}-${item.year}`

      if (!groupedExpensesData[key]) {
        groupedExpensesData[key] = [];
      }

      groupedExpensesData[key].push(item);
    })

    return groupedExpensesData;
  };

  //const budgetAmounts = budgetDetail.map(item => parseInt(item.est_amount, 10))
  //const totalBudgetAmount = budgetAmounts.reduce((total, amount) => total + amount, 0)

  const calculateBudgetTotal = (group) => {
    const budgetAmounts = group.map(item => parseInt(item.est_amount, 10))
    return budgetAmounts.reduce((total, amount) => total + amount, 0)
  }

  const calculateExpensesTotal = (group) => {
    const expensesAmounts = group.map(item => parseInt(item.amount, 10))
    return expensesAmounts.reduce((total, amount) => total + amount, 0)
  }

  {/*datasets: [
    {
    data: [balance, totalExpensesAmount],*/}

  const chartData = {
    labels: Object.keys(groupBudgetData()).map(key => `${groupBudgetData()[key][0].month}-${groupBudgetData()[key][0].year}`),
    datasets: [
      {
      label: 'Budget',
      data: Object.values(groupBudgetData()).map(group => calculateBudgetTotal(group)),
      backgroundColor: 'purple',
      },

      {
        label: 'Expenses',
        data: Object.values(groupExpensesData()).map(group => calculateExpensesTotal(group)),
        backgroundColor: '#ff5733',
      },
    ]
  }
  
  return (
    <div className='dashboard-container'>
      <div className='container d-flex justify-content-center align-items-center'>
      <div className='row'>
        <div className='' style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px'}}>
          <h4>Hello Anonymous</h4>
        </div>
        {/*<h2>Bar Chart for {selectedYear}</h2>*/}

        <div style={{width: '500px', height: '400px', margin: 'auto'}}>
          <h6 style={{display: 'flex', justifyContent: 'center'}}>Budget Overview</h6>
          <Bar
            data={chartData}
            options={{
              scales: {
                x: {
                  ticks: {
                    color: '#87ceeb'
                  },

                  grid: {
                    color: '#555'
                  }
                  
                },

                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function (value, index, values) {
                      return currency + value;
                    },
                    color: '#fff',
                  },

                  grid: {
                    color: '#555'
                  }
                }
              },
              plugins: {
                legend: {
                  labels: {
                    color: '#fff'
                  }
                },
              },
              maintainAspectRatio: false,
              responsive: true
            }}
          />
        </div>      
    </div>
        {/*<Bar data={chartDataObject} />*/}
        {/*<div>{renderedContainers}</div>*/}

        {/*<Bar
          data={chartData}
          options={{
            scales: {
              x: { title: { display: true, text: 'Month' } },
              y: { title: { display: true, text: 'Amount' } },
            },
          }}
        />
        */}
        {/*<div>
          {displayBudgetByMonth('November-2023')}
          {displayBudgetByMonth('October-2023')}
        </div>*/}

        {/*<div className='col-md-4 col-8 mx-auto p-3 offset-sm-3 box-show' style={{ display: 'grid', placeItems: 'center', marginBottom: '50px', backgroundColor: 'beige'}}>
          <h5 style={{fontFamily: 'monospace'}}>CREATE BUDGET</h5>
          <div style={{marginBottom: '20px'}}>
            <button className='btn btn-danger'>
              <Link to='/create-weekly-budget' style={{textDecoration: 'none', color: 'white'}}><h6 style={{fontSize: '12px'}}>Create Weekly Budget</h6></Link>
            </button>
          </div>

          <div style={{marginBottom: '20px'}}>
            <button className='btn btn-danger'>
              <Link to='/create-monthly-budget' style={{textDecoration: 'none', color: 'white'}}><h6 style={{fontSize: '12px'}}>Create Monthly Budget</h6></Link>
            </button>
          </div>
          
          <div>
            <button className='btn btn-danger'>
              <Link to='/create-yearly-budget' style={{textDecoration: 'none', color: 'white'}}><h6 style={{fontSize: '12px'}}>Create Yearly Budget</h6></Link>
            </button>
          </div>
        </div>
        
        <div className='col-md-4 col-8 mx-auto p-3 offset-sm-3 box-show' style={{ display: 'grid', placeItems: 'center', marginBottom: '50px', backgroundColor: '#eee'}}>
          <h5 style={{fontFamily: 'monospace'}}>VIEW BUDGET</h5>
          <div style={{marginBottom: '20px'}}>
            <button className='btn btn-dark'>
            <Link to='/weekly-budget' style={{textDecoration: 'none', color: 'white'}}><h6 style={{fontSize: '12px'}}>View Your Weekly Budgets</h6></Link>
            </button>
          </div>
          <div style={{marginBottom: '20px'}}>
            <button className='btn btn-dark'>
            <Link to='/monthly-budget' style={{textDecoration: 'none', color: 'white'}}><h6 style={{fontSize: '12px'}}>View Your Monthly Budgets</h6></Link>  
            </button>
          </div>
          <div>
            <button className='btn btn-dark'>
            <Link to='/yearly-budget' style={{textDecoration: 'none', color: 'white'}}><h6 style={{fontSize: '12px'}}>View Your Yearly Budget</h6></Link>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', placeItems: 'center'}}>
          <h5>Expenditure</h5>
        </div>*/}
        
        </div>
    </div>
    
  )
}
