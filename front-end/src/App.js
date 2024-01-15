import './App.css';
import { React, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { SignIn } from './components/Login';
import { Register } from './components/Register';
import { Logout } from './components/Logout';
import CreateMonthlyBudget from './components/CreateMonthlyBudget';
import MonthlyBudget from './components/MonthlyBudget';
import Budget from './components/Budget';
import PrivateRoutes from './components/PrivateRoutes';
import BudgetDetail from './components/BudgetDetail';
import AddBudget from './components/AddBudget';
import AddExpenses from './components/AddExpenses';
import UpdateBudget from './components/UpdateBudget';
import DeleteBudget from './components/DeleteBudget';
import UpdateExpense from './components/UpdateExpense';
import DeleteExpense from './components/DeleteExpense';
import TestCode from './components/TestCode';

import Landing from "./screens/Landing";
//import Login from "./screens/Login";
import SignUp from "./screens/Signup";
import FAQ from './components/FAQ';
import { AuthProvider } from './components/AuthContext';
//import { ProtectedRoute } from './components/ProtectedRoute';

{/*const ProtectRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('user_id')) {
      navigate('/sign-in', {replace: true});
    }
  }, [navigate]);
  return localStorage.getItem('user_id') ? (
    <Dashboard />
  ) : (
    <Navigate to='/sign-in' replace={true} />
  )
}*/}

function App() {
 
  //const isAuthenticated = (req) => req.isAuthenticated();
  //const user = ''
  
  return (
    <Router>
      <Navbar />
      <AuthProvider>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
  
        {/*<Route element={PrivateRoutes()}> 
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>*/}
        {/*<Route path='/dashboard'>
          element={localStorage.getItem('user') ? (
              <Dashboard />
            ) : (
              navigate('/', {replace: true})
          )}
            </Route>*/}
        {/*<Route path='/dashboard' element={<ProtectRoute />} />*/}
        <Route path='/dashboard' element={<Dashboard />} />
        
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
        <Route path='/test-code' element={<TestCode />} />
      </Routes>
      </AuthProvider>
    </Router> 
  );
};

export default App;
