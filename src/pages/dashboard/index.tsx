import { PrimaryButton } from '@/components/PrimaryButton'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { TransactionModel } from '@/models/Transactions'
import { API_TRANSACTION } from '@/constants/apis'
import { useRouter } from 'next/navigation'

const UserDashboard = () => {

    const [activeTab, setActiveTab] = useState('personalData')
    const router = useRouter()

    const handleTabClick = (tab: string) => {
        setActiveTab(tab)
        // fetchTransactions()
    }

    const [transactions, setTransactions] = useState<TransactionModel[]>()

    const fetchTransactions = async () => {
        try {
            const response = await fetch(API_TRANSACTION, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await response.json()
            console.log(data)
            
            if (!response.ok) {
                const errorData = await response.json()
                console.log(errorData)
                throw new Error(errorData)
            }
            setTransactions(data)
        } catch (error) {
            console.error('Error fetching transactions:', error)
        }
    }
    useEffect(() => {
        fetchTransactions()
    }, [activeTab])

    const { user } = useAuth()
    console.log(user)

    const handleReviewPage = (productID: number) => {    
        router.push(`/add_review/${productID}`)
    }

    const handleSellerDashboard = () => {    
    router.push(`/seller-dashboard`)
    }

  return (
    <div className='body-width mb-[72px] max-md:w-full max-md:px-8'>
        <div className='w-full flex justify-between items-center'>
            <div className='py-6'>
                <span className='text-3xl text-buttonBlue'>Hello, {user?.data.username!== null ? user?.data.username : 'You'}!</span>
            </div>
            {user?.data.is_seller === true ? 
                <div>
                    <PrimaryButton type='button' onClick={handleSellerDashboard}>Seller Dashboard</PrimaryButton>
                </div>
                : null
            }
            
        </div>
        
            <div className='h-auto border-[1px] rounded-[20px] border-buttonBlue'>
            
                <div className='flex gap-14 px-6 py-8 text-2xl text-buttonBlue'>
                    <span className={`cursor-pointer ${activeTab === 'personalData'? 'text-black font-bold' : '' }`} onClick={() => handleTabClick('personalData')}>Personal Data</span>
                    <span className={`cursor-pointer ${activeTab === 'addressList'? 'text-black font-bold' : '' }`} onClick={() => handleTabClick('addressList')}>Address List</span>
                    <span className={`cursor-pointer ${activeTab === 'transactionHistory'? 'text-black font-bold' : '' }`} onClick={() => handleTabClick('transactionHistory')}>Transaction History</span>
                    {user?.data.is_seller === false ? <span className={`cursor-pointer ${activeTab === 'becomeSeller'? 'text-black font-bold' : '' }`} onClick={() => handleTabClick('becomeSeller')}>Become a Seller</span> : null}
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
                                <span>{user?.data.username !== null ? user?.data.username : '-'}</span>
                                <span>{user?.data.email !== null ? user?.data.email : '-'}</span>
                                <span>{user?.data.phone !== null ? user?.data.phone : '-'}</span>
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
                            <span className='font-bold'>Mamadi</span>
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
                transactions?.map((transaction, index) => (
                
                    <div key={index} className='p-6'>
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
                                            <div className='w-auto h-auto p-2 bg-lighterBabyBlue text-buttonBlue text-xs text-center'>{transaction.status}</div>
                                        </div>
                                        <span className='font-bold'>{transaction.name}</span>
                                        <span className='font-bold'>quantity: {transaction.quantity}</span>

                                        <div className='w-full flex gap-3 items-center'>
                                            <img src='/Icon_shop.png'/>
                                            <span className='text-buttonBlue'>BabyStuffID</span>
                                        </div>
                                    </div>

                                    <div className='w-1/4 flex flex-col justify-center gap-2'>
                                        <span>Total payment</span>
                                        <span className='font-bold'>{transaction.total_price}</span>
                                    </div>
                                </div>

                                <div className='w-full flex justify-end gap-3'>
                                    <PrimaryButton type='button' onClick={() => handleReviewPage(transaction.product_id)}>Add Review +</PrimaryButton>
                                </div>
                            </div>

                        </div>
                    </div>
                 ))
            )}

{user?.data.is_seller === false ? (
    activeTab === 'becomeSeller' && (
        <div className='w-full p-6 flex justify-center'>
            <div className='w-[506px] flex flex-col gap-6 text-xl'>

                <div className='w-full space-y-1'>
                    <label className='text-buttonBlue'>Shop Name</label>
                    <input className='w-full h-10 border-2 border-formGray rounded-md' type='text'></input>
                </div>
                <div className='w-full space-y-1'>
                    <label className='text-buttonBlue'>Description</label>
                    <input className='w-full h-40 border-2 border-formGray rounded-md' type='textarea'></input>
                </div>
                <div className='w-full space-y-1'>
                    <label className='text-buttonBlue'>Location</label>
                    <input className='w-full h-10 border-2 border-formGray rounded-md' type='text'></input>
                </div>

                <div className='w-full flex justify-end'>
                    <PrimaryButton type='submit'>Submit</PrimaryButton>
                </div>

            </div>
        </div>)
        ):(
            null
        )
        }


            

        </div>
    </div>
  )
}

export default UserDashboard