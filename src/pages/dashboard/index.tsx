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
                        <div className='w-full flex justify-end gap-8 text-xl'>
                            <PrimaryButton type='button'>Change Profile Picture</PrimaryButton>
                            <PrimaryButton type='button'>Change Data</PrimaryButton>
                        </div>
                    </div>

                </div>
            </div>
            )}

            {activeTab === 'addressList' && (
            <div className='p-6'>
                <div className='w-full flex flex-col gap-6'>
                    
                    <div className='w-full flex justify-between text-xl'>
                        <div>Find Address</div>
                        <PrimaryButton type='button'>Add New Address +</PrimaryButton>
                    </div>

                    <div className='w-full p-6 flex flex-col gap-8 border-4 border-borderGray rounded-xl text-xl'>
                        <div className='w-full flex flex-col'>
                            <span className='font-bold'>Adinda Maya</span>
                            <span>083674657890</span>
                            <span>Gang Masjid Jami Al Huda, Leuwinutug, Kec. Citeureup, Kabupaten Bogor, Jawa Barat</span>
                        </div>

                        <div className='w-full flex justify-end gap-3'>
                            <PrimaryButton type='button'>Set As Main</PrimaryButton>
                            <PrimaryButton type='button'>Change</PrimaryButton>
                            <PrimaryButton type='button'>Delete</PrimaryButton>
                        </div>
                    </div>

                </div>
            </div>
            )}

            {activeTab === 'transactionHistory' && (
            <div className='p-6'>
                <div className='w-full flex flex-col gap-6'>
                    
                    <div className='w-full flex justify-between text-xl'>
                        <div>Find transaction</div>
                    </div>

                    <div className='w-full p-6 flex flex-col gap-8 border-4 border-borderGray rounded-xl text-xl'>
                        <div className='w-full flex gap-8'>
                            <div className='w-[154px] h-[154px] bg-slate-200'>
                                <img className='w-full h-auto' src=''/>
                            </div>

                            <div className='w-2/3 flex flex-col gap-2'>
                                <div className='w-full flex gap-4 items-center'>
                                    <span>25 October 2024</span>
                                    <div className='w-auto h-auto p-2 bg-lighterBabyBlue text-buttonBlue text-xs text-center'>Done</div>
                                </div>
                                <span className='font-bold'>Furnibest Stroller Baby Travel</span>
                                <div className='w-full flex gap-3 items-center'>
                                    <img src='/Icon_shop.png'/>
                                    <span className='text-buttonBlue'>BabyStuffID</span>
                                </div>
                            </div>

                            <div className='w-1/4 flex flex-col justify-center gap-2'>
                                <span>Total payment</span>
                                <span className='font-bold'>IDR 9999999</span>
                            </div>
                        </div>

                        <div className='w-full flex justify-end gap-3'>
                            <PrimaryButton type='button'>Add Review +</PrimaryButton>
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