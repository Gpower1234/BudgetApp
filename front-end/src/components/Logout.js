import React from 'react'
import { useAuth } from './AuthContext'

export const Logout = () => {

  const auth = useAuth();

  return (
    <div style={{ position: 'relative', background: 'linear-gradient(to bottom, #001f3f, #000)', height: '100vh' }}> 
      <div style={{ paddingTop: '50px', display: 'flex', justifyContent: 'center' }}>
        <button onClick={auth.logout} className='btn' style={{ backgroundColor: '#fff', color: '#001f3f' }}>Confirm Logout</button>
      </div>
    </div>  
  )
}
