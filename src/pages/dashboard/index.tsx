import { PrimaryButton } from '@/components/PrimaryButton'
import React, { useState } from 'react'

function index() {

    const [activeTab, setActiveTab] = useState('personalData')

    const handleTabClick = (tab: string) => {
        setActiveTab(tab)
    }

  return (
    <div className='body-width mb-[72px] max-md:w-full max-md:px-8'>
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

                    <div className='w-3/5 flex flex-col justify-between'>
                        <div className='w-full flex'>
                            <div className='w-1/3 flex flex-col uppercase text-xl p-6 gap-8'>
                                <span>Name</span>
                                <span>Email</span>
                                <span>Phone Number</span>
                            </div>
                            <div className='w-2/4 flex flex-col text-xl p-6 gap-8'>
                                <span>name</span>
                                <span>email</span>
                                <span>phone number</span>
                            </div>
                        </div>
                        <div className='w-full flex justify-end gap-8'>
                            <PrimaryButton type='button'>Change Profile Picture</PrimaryButton>
                            <PrimaryButton type='button'>Change Data</PrimaryButton>
                        </div>
                    </div>

                </div>
            </div>
            )}

        </div>
    </div>
  )
}

export default index