import React from 'react'

export default function PageNotFound() {
  return (
    <div style={{ background: 'linear-gradient(to bottom, #001f3f, #000)'}}>
        <div className='container'>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '50px', paddingBottom: '500px'}}>
                <h6 style={{ color: '#87ceeb'}}>ERROR 404: Page Not Found</h6>
            </div>  
        </div>
    </div>
  )
}
