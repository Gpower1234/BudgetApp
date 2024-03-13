import React, { useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
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
import { useAuth } from './AuthContext';
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
  
  const { user } = useAuth();

  const [budget, setBudget] = useState([])
  const [expenses, setExpenses] = useState([])
  const [ error, setError] = useState('')
  //const [chartData, setChartData] = useState([])
  const [dataFetched, setDataFetched] = useState(false); 

  const currency = budget.length > 0 ? budget[0].currency : '';

  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const determineGreeting = () => {
      const currentHour = new Date().getHours();

      if (currentHour >= 1 && currentHour < 12) {
        setGreeting('Good morning')
      } else if (currentHour >= 12 && currentHour < 18) {
        setGreeting('Good afternoon')
      } else {
        setGreeting('Good evening')
      }
    };
    determineGreeting()
  }, [])

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

  const calculateBudgetTotal = (group) => {
    const budgetAmounts = group.map(item => parseInt(item.est_amount, 10))
    return budgetAmounts.reduce((total, amount) => total + amount, 0)
  }

  const calculateExpensesTotal = (group) => {
    const expensesAmounts = group.map(item => parseInt(item.amount, 10))
    return expensesAmounts.reduce((total, amount) => total + amount, 0)
  }

  const chartData = {
    labels: Object.keys(groupBudgetData()).map(key => `${groupBudgetData()[key][0].month}-${groupBudgetData()[key][0].year}`),
    datasets: [
      {
      label: 'Budget',
      data: Object.values(groupBudgetData()).map(group => calculateBudgetTotal(group)),
      backgroundColor: 'lime',
      },

      {
        label: 'Expenses',
        data: Object.values(groupExpensesData()).map(group => calculateExpensesTotal(group)),
        backgroundColor: 'wheat',
      },
    ]
  }
  
  return (
    <div className='dashboard-container' style={{ height: '100vh' }}>

      <div className='sub-dashboard'>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '50px'}}>
            <h6 style={{ color: '#87ceeb'}}>{greeting}, godspower</h6>
        </div>

          <div className='bar-chart'>
            <h6 style={{display: 'flex', justifyContent: 'center'}}>Budget Overview</h6>
            <Bar
              data={chartData}
              options={{
                responsive: true,
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
    </div>
    
  )
}
