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

  style={{ borderCollapse: 'separate', borderSpacing: '30px'}}