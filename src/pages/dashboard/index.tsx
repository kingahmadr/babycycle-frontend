import React from 'react'

function index() {
  return (
    <div className='body-width mb-[72px]'>
        <div className='py-6'>
            <span className='text-3xl text-buttonBlue'>Hello, Username!</span>
        </div>
        <div className='h-auto border-[1px] rounded-[20px] border-buttonBlue'>
            <div className='flex gap-14 px-6 py-8 text-2xl'>
                <span>Personal Data</span>
                <span>Address List</span>
                <span>Transaction History</span>
                <span>Become a Seller</span>
            </div>
            <hr className='h-[3px] bg-buttonBlue'></hr>
            <div className='p-6'>
                <div className='w-full flex'>
                    <div className='w-[450px] h-[450px]'>
                        <img className='w-full h-full' src=''></img>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default index