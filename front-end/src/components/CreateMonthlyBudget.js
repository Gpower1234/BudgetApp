import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';

export default function CreateMonthlyBudget() {
  //const [selectedMonth, setSelectedMonth] = useState('');
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  console.log(months[selectedMonth])
  const [symbol, setSymbol] = useState('')

  {/*const [data, setData] = useState({
    year: '',
    month: '',
    currency: '',
  })*/}

  const navigate = useNavigate();

  const currencyOptions = [
    {value: 'Select', Symbol: 'Currency'},
    {value: 'AUD', Symbol: '$'},
    {value: 'EUR', Symbol: '€'},
    {value: 'GBP', Symbol: '£'},
    {value: 'JPY', Symbol: '¥'},
    {value: 'CAD', Symbol: '$'},
    {value: 'USD', Symbol: '$'},
    {value: 'CNY', Symbol: '¥'},
    {value: 'CHF', Symbol: 'CHF'},
    {value: 'NGN', Symbol: '₦'},
    {value: 'INR', Symbol: '₹'},
    {value: 'SEK', Symbol: 'KR'},
    {value: 'NZD', Symbol: '$'},
    {value: 'SGD', Symbol: '$'},
    {value: 'ZAR', Symbol: 'R'},
    {value: 'RUB', Symbol: '₽'}
  ]


  useEffect(() => {
      const currentYear = new Date().getFullYear();
      const nextFiveYears = Array.from({ length: 5 }, (_ , index) => currentYear + index);
      setYears(nextFiveYears);

      const currentMonth = new Date().getMonth();
      const monthsForSelectedYear = selectedYear === currentYear
        ? Array.from({ length: 12 - currentMonth }, (_ , index) => new Date(currentYear, currentMonth + index, 1).toLocaleString('en-US', { month: 'long'}))
        : Array.from({ length: 12 }, (_ , index) => new Date(currentYear, index, 1).toLocaleString('en-US', { month: 'long'}));
      setMonths(monthsForSelectedYear)
  }, [selectedYear])

 {/* const generateMonthOptions = () => {
    const today = new Date();
    const options = []

    for (let i=0; i<9; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i);
      const month = date.toLocaleString('default', { month: 'long'});
      const year = date.getFullYear();
      const optionValue = `${month}-${year}`;
      options.push(
        <option key={optionValue} value={optionValue}>
          {month} {year}
        </option>
      );
    }
    return options;
  };*/}

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // show the spinner
    setIsLoading(true)

    const formData = {
      year: selectedYear,
      month: months[selectedMonth],
      currency: symbol
    }

    console.log(formData)

    {/*const formdata = new FormData();
    formdata.append('month', data.month);
    formdata.append('budgetName', data.currency);
    formdata.append('amount', data.total_amount);*/}
    axios.post('http://localhost:5001/create-budget', formData)
    .then(res => {
      if (res.data.status === 'success') {
        setTimeout(() => {
          setSuccess(res.data.status)
          setIsLoading(false);
          navigate(`/monthly-budget?message=${encodeURIComponent(formData.month + ' ' + formData.year + ' ' + 'budget started!')}`);
        }, 2000);
      } else {
            setError(formData.month + ' ' + formData.year + ' ' + 'budget already exists')
            setIsLoading(false) 
      }
      

      {/*if (res.data.status === 'success') {
        setSuccess(res.data.status)
        setIsLoading(false)
        navigate('/monthly-budget')
      } else {
        setError('Error creating budget')
      }*/}
    })
  }

  return (
    <div style={{ position: 'relative', background: 'linear-gradient(to bottom, #001f3f, #000)', height: '100vh'}}>
        <div className='row justify-content-center'>
          <div className='text-danger text-center mb-4'>
              {error && error}
          </div>
          <div className='text-success text-center'>
              {success && success}
          </div>

          {isLoading &&
          <div className='col-md-3 col-8' style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '9999'}}>
              <div style={{ display: 'grid', placeItems: 'center'}}>
                {isLoading && <MoonLoader size={30} color={'#001f3f'} />}
                {isLoading && <p style={{ color: '#001f3f'}}>creating...</p>}
              </div>
          </div>
          }
          
          <div className='col-md-3 col-8' style={{ backgroundColor: '#87ceeb', padding: '15px', borderRadius: '15px', marginTop: '50px'}}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <h5 style={{fontFamily: 'monospace', color: '#001f3f'}}>CREATE MONTHLY BUDGET</h5>
            </div> 
            
            <br /> 
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <select className='form-select form-select-sm' value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}>
                      {years.map((year) => (
                          <option key={year} value={year}>
                              {year}
                          </option>
                      ))}
                </select>
              </div>
              
              {/*<div className='mb-3'>
                <select className='form-select'aria-label='elect month' onChange={e => setData({...data, month: e.target.value})}>
                  <option value="">Select Month</option>
                  {generateMonthOptions()}
                </select>
              </div>

              <div className='mb-3'>
                <select className='form-select'aria-label='elect month' onChange={e => setData({...data, currency: e.target.value})}>
                  {currencyOptions.map((currency) => {
                    return <option key={currency.value} value={currency.Symbol}>
                      {currency.Symbol} - {currency.value}
                    </option>
                  })}
                </select>
                </div>*/}

              <div className='mb-3'>
                <select className='form-select form-select-sm' value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                  <option value="">Select Month</option>
                      {months.map((month, index) => (
                          <option key={index} value={index}>
                              {month}
                          </option>
                      ))}
                </select>
              </div>
              
              <div className='mb-3'>
                <select className='form-select form-select-sm' aria-label='elect month' onChange={e => setSymbol(e.target.value)}>
                  {currencyOptions.map((currency) => {
                    return <option key={currency.value} value={currency.Symbol}>
                      {currency.Symbol} - {currency.value}
                    </option>
                  })}
                </select>
              </div>

              <div className='text-center'>
                <button type='submit' className='btn btn-primary'>Start</button>
              </div>
            </form>
          </div> 
        </div>
    </div>
  )
};
