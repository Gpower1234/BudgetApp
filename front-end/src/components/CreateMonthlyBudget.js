import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';
import { useAuth } from './AuthContext';

export default function CreateMonthlyBudget() {
  //const [selectedMonth, setSelectedMonth] = useState('');
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [symbol, setSymbol] = useState('')
  const [message, setMessage] = useState('')

  const { user } = useAuth();

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


  const handleSubmit = (event) => {
    event.preventDefault();

    // show the spinner
    setIsLoading(true)

    const formData = {
      user: user.email,
      year: selectedYear,
      month: months[selectedMonth],
      currency: symbol
    }

    axios.post(process.env.REACT_APP_API_URL + '/create-budget', formData)
    .then(res => {
      if (res.data.status === 'success') {
        setTimeout(() => {
          setSuccess(res.data.message)
          setIsLoading(false);
          setTimeout(() => {
            navigate('/monthly-budget')
          }, 3000)
          //navigate(`/monthly-budget?message=${encodeURIComponent(formData.month + ' ' + formData.year + ' ' + 'budget started!')}`);
        }, 5000);
      } else {
            setError(formData.month + ' ' + formData.year + ' ' + 'budget already exists')
            setIsLoading(false) 
      }
    })
  }

  return (
    <div style={{ position: 'relative', background: 'linear-gradient(to bottom, #001f3f, #000)', height: '100vh'}}>
        <div className='row justify-content-center' style={{ paddingTop: '30px' }}>
          
          <div className='text-center' style={{ color: '#28a745' }}>
              <p style={{ fontSize: '20px', fontWeight: 'bold'}}>{success && success}</p>
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
            <div className='text-danger text-center mb-4'>
              {error && error}
            </div>
             
            {/*<div className='text-center'>
              <p style={{ color: '#fff' }}>Wants to create a budget for an event such as birthday, wedding etc? <Link style={{ color: '#87ceeb', textDecoration: 'none' }} to='/create-defined-budget'></Link></p>
        </div>*/}
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
