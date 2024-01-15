import React from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
//import backgroundImage from '../images/image9.jpg';
import '../CSS/home.css';

import { Doughnut, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

export const Home = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const successMessage = query.get('message');
  const navigate = useNavigate();

  const balance = '150'
  const totalExpensesAmount = '1200'
  const totalBudgetAmount = '1300'
  const month = 'June'
  
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
        text: 'June Expenses/Balance Chart',
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
  };

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

  const handleClic = () => {
    console.log('Handle click initiated')
    navigate('/create-monthly-budget')
  }

  function handleClick() {
    navigate('/create-monthly-budget')
  }

  return (
    <div className='dashboard-container'>
      <div style={{ display: 'grid', placeItems: 'center', marginTop: '50px'}}>
         
        <h4>Overview</h4>
        <section className='container'>
          <p>
            Planning how we spend our income by allocating funds to every expenses prior to the time of execution is what most
            people desire.
          </p>
          <p>
            This Site helps you in keeping track of your monthly expenses base on your scheduled budget. By recording all your
            daily expenses, you will keep track on what your funds what spent on at the end of each month.
          </p>
        </section>

        <h4>Budget Detail Data Sample</h4>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div style={{width: '200px', height: '200px', color: '#fff'}}>
            <Doughnut options={doughnutOption} data={doughnutChartData} style={{ color: '#fff' }} />
            <p style={{ fontSize: '12px', display: 'flex', justifyContent: 'center'}}>Expenses Total Amount: $100</p>
            <p style={{ fontSize: '12px', display: 'flex', justifyContent: 'center'}}>Balance: $50</p>
          </div>

          <div style={{width: '300px', height: '300px', color: '#fff'}}>
            <Bar options={option} data={barChartData} />
            <p style={{ fontSize: '12px', display: 'flex', justifyContent: 'center'}}>Budget Total Amount: $180</p>
            <p style={{ fontSize: '12px', display: 'flex', justifyContent: 'center'}}>Expenses Total Amount: $150</p>
          </div>
       </div>

       <h4>Monthly Data Overview Sample</h4>
       <div className='container' style={{ display: 'flex', justifyContent: 'center', maxWidth: '450px', marginBottom: '80px'}}>
          <Bar
            data={{
              // Name of the variables on x-axis for each bar
              labels: ['September 2023 Budget', 'September 2023 Expenses', 'October 2023 Budget', 'October 2023 Budget'],
              datasets: [
                {
                  // Label for bars
                  label: 'total count/value',
                  // Data or value of each variable
                  data: [1552, 1319, 613, 1400],
                  backgroundColor: ["lime", "wheat", "lime", "wheat"],
                  borderColor: ["lime", "wheat", "lime", "wheat"],
                  borderWidth: 0.5,
                }
              ]
            }}

            // Height of graph
            height={400}
            options={{
              maintainAspectRatio: false,
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
              legend: {
                labels: {
                  fontSize: 15,
                }
              },
            }}
          />
       </div>
       <div className='container' style={{ display: 'grid', placeItems: 'center', marginTop: '50px', marginBottom: '150px'}}>
          <p>Start monitoring your monthly expenses and keep it inline with your Budget.</p>
          <button className='btn' style={{ fontSize: '14px', backgroundColor: '#87ceeb' }}>
            <Link to='/create-monthly-budget' style={{ textDecoration: 'none', color: '#000' }}>Create Budget</Link>
          </button>
       </div>
      </div> 
    </div>
  )
}
