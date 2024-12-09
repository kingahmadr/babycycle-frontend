import React, { useState } from 'react'

function index() {

    const [activeTab, setActiveTab] = useState('personalData')

    const handleTabClick = (tab: string) => {
        setActiveTab(tab)
    }

  return (
    <div className='body-width mb-[72px]'>
        <div className='py-6'>
            <span className='text-3xl text-buttonBlue'>Hello, Username!</span>
        </div>
        <div className='h-auto border-[1px] rounded-[20px] border-buttonBlue'>
            <div className='flex gap-14 px-6 py-8 text-2xl text-buttonBlue'>
                <span className={`cursor-pointer ${activeTab === 'personalData'? 'text-black font-bold' : '' }`} onClick={() => handleTabClick('personalData')}>Personal Data</span>
                <span className={`cursor-pointer ${activeTab === 'addressList'? 'text-black font-bold' : '' }`} onClick={() => handleTabClick('addressList')}>Address List</span>
                <span className={`cursor-pointer ${activeTab === 'transactionHistory'? 'text-black font-bold' : '' }`} onClick={() => handleTabClick('transactionHistory')}>Transaction History</span>
                <span className={`cursor-pointer ${activeTab === 'becomeSeller'? 'text-black font-bold' : '' }`} onClick={() => handleTabClick('becomeSeller')}>Become a Seller</span>
            </div>
            <hr className='h-[3px] bg-buttonBlue'></hr>
            
            {activeTab === 'personalData' && (
            <div className='p-6'>
                <div className='w-full flex'>
                    <div className='w-[450px] h-[450px]'>
                        <img className='w-full h-full' src=''></img>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
            )}

        </div>
    </div>
  )
}

export default index