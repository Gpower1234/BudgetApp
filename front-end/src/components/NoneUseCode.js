axios.post('http:localhost:5000/auth/local', { username, password })
.then(response => {
  // Handle successful login
  console.log('Login successful:', response.data);
})
.catch(error => {
  // Handle login error
  console.error('Login error:', error.response.data.message);
});


const handleSignup = () => {
    axios.post('http://localhost:5000/auth/register', { username, email, password })
      .then(response => {
        console.log('Registration successful:', response.data);
      })
      .catch(error => {
        console.error('Registration Error', error.response.data.message);
      });

    // Check if the passwords match
    if (password !== confirmPassword) {
      setError('Passwords fo not match');
      return;
    }

    useEffect(() => {
      axios.get('http://localhost:5001/monthly-budget/'+month)
      .then(res => {
        if (res.data.status === 'success') {
          setMonthlyBudgetDetail(res.data.Result)
        } if (res.data.status === 'Error') {
          setError(res.data.Error)
        }
      }).catch(err => {'Error fetching data'})
    }, [])
    
    };

     {/*(
      <div key={targetMonth}>
        <h2>{targetMonth}</h2>
        {filteredData.map(item => (
          <div key={item.id}>
            <p>Name: {item.name}</p>
            <p>Amount: {item.estimated_amount}</p>
          </div>
        ))
      </div>
    )*/}

    {/*const [budget, setBudget] = useState([])
  const [expenses, setExpenses] = useState([])
  const [error, setError] = useState('')

  const getUniqueMonths = () => {
    const uniqueMonths = [...new Set(budget.map(item => item.month))];
    console.log(uniqueMonths)
    return uniqueMonths
  }

  
  const displayBudgetByMonth = (targetMonth) => {
    const filteredData = budget.filter(item => item.budget_month === targetMonth)
    const budgetAmounts =filteredData.map(item => parseInt(item.est_amount, 10))
    const totalAmount = budgetAmounts.reduce((total, amount) => total + amount, 0);
    return (
      <div key={targetMonth}>
        <h2>{targetMonth}</h2>
        <p>Total: {totalAmount}</p>
      </div>
    )
  }*/}

 {/* const filterDataByMonth = (targetMonth) => {
    return budget ? budget.filter(item => item.budget_month && item.budget_month.includes(targetMonth)) : [];
  }

  const displayBudgetByMonth = (targetMonth) => {
    const filteredData = filterDataByMonth(targetMonth)
    return (
      <div>
        <h2>{targetMonth}</h2>
        {filteredData.map(item => {
          <div key={item.id}>
            <p>Name: {item.name}</p>
            <p>Amount: {item.amount}</p>
          </div>
        })}
      </div>
    )
  }
*/}
  {/*useEffect(() => {
    axios.get('http://localhost:5001/budget')
    .then(res => {
      if (res.data.status === 'success') {
        setBudget(res.data.Result)
      } else {
        setError(res.data.Error)
      }
    }).catch(err => {'Error fetching data'});

    axios.get('http://localhost:5001/expenses')
    .then(res => {
      if (res.data.status === 'success') {
        setExpenses(res.data.Result)
      } else {
        setError(res.data.Error)
      }
    }).catch(err => {'Error fetching data'});

    }, [])*/}

  //axios.get('http://localhost:5001/dashboard')
  {/*const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
        const response = await axios.get('http://localhost:5001/dashboard');
        setUser(response.data);
        console.log(setUser)
        } catch (error) {
        console.error('Error fetching user data:', error);
        }
    };*/}


    useEffect(() => {
      if (budget.length > 0) {
        console.log('Sample Budget Entry:', budget[0])
      }
  
      if (expense.length > 0) {
        console.log('Sample Expenses Entry:', expense[0])
      }
    }, [budget, expense])
  
    useEffect(() => {
      console.log('Organized Budget Data:', organizedBudgetData);
      console.log('Organized Expenses Data:', organizedExpensesData);
      const years = Object.keys(organizedBudgetData);
      console.log('years:', years)
        
      const datasets = years.map(year => {
        const budgetDataArray = organizedBudgetData[year] || [];
        const expensesDataArray = organizedExpensesData[year] || [];
        return {
          label: year,
          data: Array.from({ length: 12 }, (_, monthIndex) => {
            const key = `${year}-${monthIndex + 1}`;
            const budgetTotal = calculateTotalBudgetAmount(organizedBudgetData[key] || []);
            const expensesTotal = calculateTotalExpensesAmount(organizedExpensesData[key] || []);
            return {x: monthIndex + 1, yBudget: budgetTotal, yExpenses: expensesTotal};
          }),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWith: 1
          }
      });
  
      console.log('Datasets', datasets)
  
      setChartData({
        labels: Array.from({ length: 12 }, (_, index) => index + 1),
        datasets,
      })
      }, [organizedBudgetData, organizedExpensesData])
  

      const renderedContainers = Object.keys(organizedBudgetData).map(key => (
        <div key={key}>
          <h2>{`Month: ${organizedBudgetData[key][0].month}, Year: ${organizedBudgetData[key][0].year}`}</h2>
          {/*{organizedBudgetData[key].map(entry => (
            <div key={entry.name}>
              <p>{`Amount: ${entry.est_amount}`}</p>
            </div>
          ))}*/}
          <p>Budget Total: {`Total Amount: ${calculateTotalBudgetAmount(organizedBudgetData[key])}`}</p>
    
          {/*{organizedExpensesData[key].map(entry => (
            <div key={entry.name}>
              <p>{`Amount: ${entry.amount}`}</p>
            </div>
          ))}*/}
          <p>Expense Total: {`Total Amount: ${calculateTotalExpensesAmount(organizedExpensesData[key])}`}</p>
        </div>
        
      )); 

{/*console.log('Budget:', budget)
  console.log('Expenses:', expense)

  useEffect(() => {
    axios.get('http://localhost:5001/budget')
    .then(res => {
      if (res.data.status === 'success') {
        setBudget(res.data.Result)
      } else {
        setError(res.data.Error)
      }
    }).catch(err => {'Error fetching data'});

    axios.get('http://localhost:5001/expenses')
    .then(res => {
      if (res.data.status === 'success') {
        setExpense(res.data.Result)
      } else {
        setError(res.data.Error)
      }
    }).catch(err => {'Error fetching data'});

    }, [])*/}

  {/*
  const calculateTotalBudgetAmount = (data) => data.reduce((total, entry) => total + entry.est_amount, 0);

  const calculateTotalExpensesAmount = (data) => data.reduce((total, entry) => total + entry.amount, 0);

  //const budgetAmounts = budgetDetail.map(item => parseInt(item.est_amount, 10))
  //const totalBudgetAmount = budgetAmounts.reduce((total, amount) => total + amount, 0)
  

  const organizedBudgetData = {};
  budget.forEach(entry => {
    const key = `${entry.year}-${entry.month}`;
    if (!organizedBudgetData[key]) {
      organizedBudgetData[key] = [];
    }
    organizedBudgetData[key].push(entry);
  });

  const organizedExpensesData = {};
  expense.forEach(entry => {
    const key = `${entry.year}-${entry.month}`;
    if (!organizedExpensesData[key]) {
      organizedExpensesData[key] = [];
    }
    organizedExpensesData[key].push(entry);
  });
*/}
  {/*useEffect(() => {
    if (budget.length > 0) {
      console.log('Sample Budget Entry:', budget[0])
    }

    if (expense.length > 0) {
      console.log('Sample Expenses Entry:', expense[0])
    }
  }, [budget, expense])*/}

  {/* useEffect(() => {
    console.log('Organized Budget Data:', organizedBudgetData);
    console.log('Organized Expenses Data:', organizedExpensesData);
    const years = Object.keys(organizedBudgetData);
    console.log('years:', years)
      
    const datasets = years.map(year => {
      const budgetDataArray = organizedBudgetData[year] || [];
      const expensesDataArray = organizedExpensesData[year] || [];
      return {
        label: year,
        data: Array.from({ length: 12 }, (_, monthIndex) => {
          const key = `${year}-${monthIndex + 1}`;
          const budgetTotal = calculateTotalBudgetAmount(organizedBudgetData[key] || []);
          const expensesTotal = calculateTotalExpensesAmount(organizedExpensesData[key] || []);
          return {x: monthIndex + 1, yBudget: budgetTotal, yExpenses: expensesTotal};
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWith: 1
        }
    });

    console.log('Datasets', datasets)

    setChartData({
      labels: Array.from({ length: 12 }, (_, index) => index + 1),
      datasets,
    })
    }, [organizedBudgetData, organizedExpensesData])

  */}

  {/*useEffect(() => {
    const fetchData = async () => {
      try {
        const budgetResponse = await axios.get('http://localhost:5001/budget');
        const expensesResponse = await axios.get('http://localhost:5001/expenses');

        setBudget(budgetResponse.data)
        setExpenses(expensesResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    };

    fetchData();
  }, [])*/}

 {/* useEffect(() => {
    console.log('Second useEffect initiated')
    if (dataFetched && budget.length > 0 && expenses.length > 0) {
      console.log('Second useEffect initiated, after the logic')
      const processedData = processData(budget, expenses, selectedYear);
    
      // Update the state with the processed data
      setChartData(processedData);
    }
    
  }, [selectedYear, budget, expenses])*/}

  {/*const processData = (budgetData, expensesData, selectedYear) => {
    const filteredBudget = budgetData.filter(item => item.year === selectedYear);
    const filteredExpenses = expensesData.filter(item => item.year === selectedYear);

    const budgetTotals = [];
    const expensesTotals = [];

    filteredBudget.forEach(item => {
      const { month, amount } = item;
      budgetTotals[month] = (budgetTotals[month] || 0) + amount;
    });

    filteredExpenses.forEach(item => {
      const { month, amount } = item;
      budgetTotals[month] = (budgetTotals[month] || 0) + amount;
    });

    return {
      budget: budgetTotals,
      expenses: expensesTotals
    };

  };

  console.log('BUDGET CHART DATA:', chartData.budget)
  console.log('EXPENSES CHART DATA:', chartData.expenses)

  const chartDataObject = {
    labels: Object.keys(chartData.budget),
    datasets: [
      {
        label: 'Budget',
        data: Object.values(chartData.budget),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },

      {
        label: 'Expenses',
        data: Object.values(chartData.budget),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ]
  }*/}

// LOGIN SNIPPETS
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import { MoonLoader } from 'react-spinners';
import '../CSS/Login.css';
//import './styles/login.css';


export const SignIn = () => {

  //const [username, setUsername] = useState("");
  //const [password, setPassword] = useState("");
  //const [error, setError] = useState("");

  const [formData, setFormData] = useState({ username: '', password: ''})
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  }

  const navigate = useNavigate();

  const handleLoginWithGoogle = (response) => {
    axios.post('/auth/google', response)
    .then((res) => {
      // Handle the response from the server
      if (res.data.success) {
        navigate('/dashboard')
      } else {
        alert('Login failed: Please try again.')
      }
    })
    .catch((error) => {
      console.error('Error:', error)
      // Handle errors
    })
  };

  const handleLocalLogin = (e) => {
    e.preventDefault();
    setIsLoading(true)
    // Send the username and password to the backend for local login
    axios.post('http://localhost:5001/login', formData)
    .then((res) => {
      if (res.data.status === 'success') {
        setTimeout(() => {
          setIsLoading(false)
          navigate(`/?message=${encodeURIComponent('logged in success')}`)
        }, 3000)} else {
          console.log('Error')
        }
      // Redirect to the dashboard or handle user state as needed
    }).catch((error) => {
      console.error(error);
    });
  }
{/*
  function handleChangeUsername(event) {
    setUsername(event.target.value)
  };

  function handleChangePassword(event) {
    setPassword(event.target.value)
  };
*/}
  return (
    <div className='login-container'>
      <div className='row justify-content-center'>
        <div className='col-md-4 col-8'>
          <h4 style={{ color: '#87ceeb', fontFamily: 'monospace', marginBottom: '50px'}} className='text-center'>Sign <b style={{fontFamily: 'monospace', color: '#87cefa'}}>In</b></h4>
          
          {/*<div className='mb-3 text-center'>
            <button style={{ backgroundColor: '#f43', color: '#fff', border: 'none', borderRadius: '5px' }} onClick={handleLoginWithGoogle}>Login with Google</button>
  </div>*/}
          {/*<GoogleLogin
          clientId="YOUR GOOGLE CLIENT ID"
          buttonText="Login with Google"
          onSuccess={handleLoginWithGoogle}
          onFailure={handleLoginWithGoogle}
          cookiePolicy={'single_host_origin'}
/>*/}
          <div className='mb-3 text-center' style={{ marginTop: '50px' }}>
            <h5 style={{color: '#fff'}}>or</h5>
          </div>
          {isLoading &&
          <div className='col-md-3 col-8' style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '9999'}}>
              {isLoading && <MoonLoader size={30} color={'red'} />}
          </div>
          }
          <div style={{ marginTop: '50px' }}>
            
            <form onSubmit={handleLocalLogin}>
              <div className='mb-3'>
                <label  htmlFor='username'className='form-label'>Username</label>
                <input type='text' className='form-control' id='username' placeholder='Enter username' name='username' onChange={handleInputChange} />
              </div>
              <div className='mb-3'>
                <label  htmlFor='password'className='form-label'>Password</label>
                <input type='password' className='form-control' id='password' placeholder='Enter password' name='password' onChange={handleInputChange} />
              </div>
              <p>Don't have an account? <Link to='/sign-up' style={{ color: '#dc3545', textDecoration: 'none' }}>Sign Up</Link></p>
              <div className='text-center'>
                <button type='submit' className='btn btn-danger'>Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
};


function navigate(url){
  window.location.href = url 
}

async function auth(){
  const response = await fetch('http://127.0.0.1:5000/request',
  {method: 'post'});
  const data = await response.json();
  navigate(data.url)
}

// Sign In

 //const [username, setUsername] = useState("");
  //const [password, setPassword] = useState("");
  //const [error, setError] = useState("");

  const [formData, setFormData] = useState({ username: '', password: ''})
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  }

  const navigate = useNavigate();

  const handleLoginWithGoogle = (response) => {
    axios.post('/auth/google', response)
    .then((res) => {
      // Handle the response from the server
      if (res.data.success) {
        navigate('/dashboard')
      } else {
        alert('Login failed: Please try again.')
      }
    })
    .catch((error) => {
      console.error('Error:', error)
      // Handle errors
    })
  };

  const handleLocalLogin = (e) => {
    e.preventDefault();
    setIsLoading(true)
    // Send the username and password to the backend for local login
    axios.post('http://localhost:5001/login', formData)
    .then((res) => {
      if (res.data.status === 'success') {
        setTimeout(() => {
          setIsLoading(false)
          navigate(`/?message=${encodeURIComponent('logged in success')}`)
        }, 3000)} else {
          console.log('Error')
        }
      // Redirect to the dashboard or handle user state as needed
    }).catch((error) => {
      console.error(error);
    });
  }
{/*
  function handleChangeUsername(event) {
    setUsername(event.target.value)
  };

  function handleChangePassword(event) {
    setPassword(event.target.value)
  };
*/}
  return (
    <div className='login-container'>
      <div className='row justify-content-center'>
        <div className='col-md-4 col-8'>
          <h4 style={{ color: '#87ceeb', fontFamily: 'monospace', marginBottom: '50px'}} className='text-center'>Sign <b style={{fontFamily: 'monospace', color: '#87cefa'}}>In</b></h4>
          
          {/*<div className='mb-3 text-center'>
            <button style={{ backgroundColor: '#f43', color: '#fff', border: 'none', borderRadius: '5px' }} onClick={handleLoginWithGoogle}>Login with Google</button>
  </div>*/}
          {/*<GoogleLogin
          clientId="YOUR GOOGLE CLIENT ID"
          buttonText="Login with Google"
          onSuccess={handleLoginWithGoogle}
          onFailure={handleLoginWithGoogle}
          cookiePolicy={'single_host_origin'}
/>*/}
          <div className='mb-3 text-center' style={{ marginTop: '50px' }}>
            <h5 style={{color: '#fff'}}>or</h5>
          </div>
          {isLoading &&
          <div className='col-md-3 col-8' style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '9999'}}>
              {isLoading && <MoonLoader size={30} color={'red'} />}
          </div>
          }
          <div style={{ marginTop: '50px' }}>
            
            <form onSubmit={handleLocalLogin}>
              <div className='mb-3'>
                <label  htmlFor='username'className='form-label'>Username</label>
                <input type='text' className='form-control' id='username' placeholder='Enter username' name='username' onChange={handleInputChange} />
              </div>
              <div className='mb-3'>
                <label  htmlFor='password'className='form-label'>Password</label>
                <input type='password' className='form-control' id='password' placeholder='Enter password' name='password' onChange={handleInputChange} />
              </div>
              <p>Don't have an account? <Link to='/sign-up' style={{ color: '#dc3545', textDecoration: 'none' }}>Sign Up</Link></p>
              <div className='text-center'>
                <button type='submit' className='btn btn-danger'>Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )

  <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
  
        {/*<Route element={PrivateRoutes()}> 
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>*/}
        
        {/*<Route path='/dashboard' element={<Dashboard />} />*/}
        
        <Route path="/sign-up" element={<Register />} />
  
        <Route path="/dashboard" element={user?.email ? <Navigate to="/home" /> : <Register />} />
        {/*<Route path="/sign-in" element={<Login />} />*/}
  
        <Route path="/sign-out" element={<Logout />} />
        <Route path='/budget' element={<Budget />} />
        <Route path='/create-monthly-budget' element={<CreateMonthlyBudget />} />
        <Route path='/monthly-budget' element={<MonthlyBudget />} />
        <Route path='/budget-detail/:month/:year' element={<BudgetDetail />} />
        <Route path='/add-budget' element={<AddBudget />} />
        <Route path='/add-expenses' element={<AddExpenses />} />
        <Route path='/update-budget/:id' element={<UpdateBudget />} />
        <Route path='/delete-budget/:id' element={<DeleteBudget />} />
        <Route path='/update-expense/:id' element={<UpdateExpense />} />
        <Route path='/delete-expense/:id' element={<DeleteExpense />} />
        <Route path='/FAQ' element={<FAQ />} />
        <Route path='/test-code' element={<TestCode />} />
      </Routes>
    </Router>



<AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          {/*<ProtectedRoute path='/dashboard' element={<Dashboard />} />
          <ProtectedRoute path='/monthly-budget' element={<MonthlyBudget />} />*/}
          <Route exact path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
  
        {/*<Route element={PrivateRoutes()}> 
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>*/}
        
        <Route path='/dashboard' element={<ProtectedRoute>{<Dashboard />}</ProtectedRoute>} />
        
        <Route path="/sign-up" element={<Register />} />
  
        {/*<Route path="/dashboard" element={user?.email ? <Navigate to="/home" /> : <Register />} />*/}
        {/*<Route path="/sign-in" element={<Login />} />*/}
  
        <Route path="/sign-out" element={<Logout />} />
        <Route path='/budget' element={<Budget />} />
        <Route path='/create-monthly-budget' element={<CreateMonthlyBudget />} />
        <Route path='/monthly-budget' element={<MonthlyBudget />} />
        <Route path='/budget-detail/:month/:year' element={<BudgetDetail />} />
        <Route path='/add-budget' element={<AddBudget />} />
        <Route path='/add-expenses' element={<AddExpenses />} />
        <Route path='/update-budget/:id' element={<UpdateBudget />} />
        <Route path='/delete-budget/:id' element={<DeleteBudget />} />
        <Route path='/update-expense/:id' element={<UpdateExpense />} />
        <Route path='/delete-expense/:id' element={<DeleteExpense />} />
        <Route path='/FAQ' element={<FAQ />} />
        </Routes>
      </Router>
    </AuthProvider>