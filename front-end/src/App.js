import './App.css';
import { React } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { SignIn } from './components/Login';
import { Register } from './components/Register';
import { Logout } from './components/Logout';
import CreateMonthlyBudget from './components/CreateMonthlyBudget';
import MonthlyBudget from './components/MonthlyBudget';
import BudgetDetail from './components/BudgetDetail';
import UpdateBudget from './components/UpdateBudget';
import DeleteBudget from './components/DeleteBudget';
import UpdateExpense from './components/UpdateExpense';
import DeleteExpense from './components/DeleteExpense';
import FAQ from './components/FAQ';
import { AuthProvider, useAuth } from './components/AuthContext';
import CreateDefinedBudget from './components/CreateDefinedBudget';
import PageNotFound from './components/PageNotFound';

function App() {
  const { user } = useAuth();
  
  return (
    <Router>
      <Navbar />
      <AuthProvider>
        <Routes>
          <Route exact path="/testing" element={<Logout />} />
          <Route exact path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<Register />} />
          <Route path="/sign-out" element={<Logout />} />
          <Route path='/dashboard' element={user ? <Dashboard /> : <SignIn />} />
          <Route path='/create-monthly-budget' element={user ? <CreateMonthlyBudget /> : <SignIn />} />
          <Route path='/monthly-budget' element={user ? <MonthlyBudget /> : <SignIn /> } />
          <Route path='/create-defined-budget' element={user ? <CreateDefinedBudget /> : <SignIn /> } />
          <Route path='/budget-detail/:month/:year' element={user ? <BudgetDetail /> : <SignIn />}  />
          <Route path='/update-budget/:id' element={user ? <UpdateBudget /> : <SignIn /> }  />
          <Route path='/delete-budget/:id' element={user ? <DeleteBudget /> : <SignIn /> }  />
          <Route path='/update-expense/:id' element={user ? <UpdateExpense /> : <SignIn /> }  />
          <Route path='/delete-expense/:id' element={user ? <DeleteExpense /> : <SignIn /> } />
          <Route path='/FAQ' element={<FAQ />} />
          {/* Catch all route for any unmatched URL */}
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </AuthProvider>
    </Router> 
  );
};

export default App;
