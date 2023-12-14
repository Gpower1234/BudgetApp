import React from 'react'

export default function AddBudget() {
  return (
    <div className='container'>
        <div className='row justify-content-center'>
            <div className='col-md-3 col-8'>
                <form>
                    <div className='mb-3'>
                        <input type='text' hidden className='form-control' id='name' placeholder='Budget Name'/>
                    </div>
                    <div className='mb-3'>
                        <input type='text' className='form-control' id='name' placeholder='Budget Name'/>
                    </div>
                    
                    <div className='mb-3'>
                        <input type='number' className='form-control' id='amount' placeholder='Estimated Amount'/>
                    </div>

                    <div className='text-center'>
                        <button type='submit' className='btn btn-danger'>ADD BUDGET</button>
                    </div>
                </form>
            </div>
        </div> 
    </div>
  )
}
