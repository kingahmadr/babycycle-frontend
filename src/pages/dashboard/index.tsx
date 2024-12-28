import { PrimaryButton } from '@/components/PrimaryButton'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { TransactionModel } from '@/models/Transactions'
import { API_TRANSACTION, API_ADDRESSES } from '@/constants/apis'
import { useRouter } from 'next/navigation'
import { convertDate } from "@/utils/formatDate";
import { SecondaryButton } from '@/components/SecondaryButton'
import { enqueueSnackbar } from "notistack";
import { AddressModel } from '@/models/Address'
import { DataWithCount } from '@/models/DataWithCount'
import  ModalsAddress from '@/components/ModalsAddress'

const UserDashboard = () => {

    const [activeTab, setActiveTab] = useState('personalData')
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleTabClick = (tab: string) => {
        setActiveTab(tab)
    }

    const [transactions, setTransactions] = useState<TransactionModel[]>()
    const [addresses, setAddresses] = useState<AddressModel[]>([
        {
          address: '',
          name: '',
          contact: '',
        },
      ]);

    const [addressListData, setAddressListData] = useState<DataWithCount<AddressModel> | undefined>()

    const getAddressById = async ( id: number) => {
        try {
            const response = await fetch(`${API_ADDRESSES}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error updating address:', errorData);
                enqueueSnackbar(errorData.message || 'Failed to update address.', {
                    variant: 'error',
                });
                return
            }
           
            const data = await response.json();
            setAddresses(data);
            setShowAddressModal(true)
            
        } catch (error) {
            console.error('Error updating address:', error);
        }
        
      };

    const handleInputChange = (index: number, field: string, value: string) => {
        setAddresses((prev) =>
          prev.map((address, i) =>
            i === index ? { ...address, [field]: value } : address
          )
        );
      };

    const fetchAddresesList = async () => {
        try {
            const response = await fetch(API_ADDRESSES, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error fetching addresses:', errorData);
                return
            }
            const data = await response.json();
            setAddressListData(data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const fetchAddresses = async () => {
        try {
          setLoading(true);
      
          // Validation to ensure all fields in the array are filled
          for (const address of addresses) {
            if (!address.name || !address.contact || !address.address) {
              enqueueSnackbar('Please fill in all the fields for each address', { variant: 'error' });
              return;
            }
          }
      
          // Perform the POST request
          const response = await fetch(API_ADDRESSES, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(addresses),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error adding new addresses:', errorData);
            enqueueSnackbar('Failed to add addresses. Please try again.', { variant: 'error' });
            return;
          }
      
          enqueueSnackbar('Addresses added successfully!', { variant: 'success' });
      
          // Mock delay (optional)
          await new Promise((resolve) => setTimeout(resolve, 1000));
      
          // Reset the form and close the modal
          setShowAddressModal(false);
          setAddresses([
            {
              address: '',
              name: '',
              contact: '',
            }
          ]); 
          
        } catch (error) {
          console.error('Error fetching addresses:', error);
          enqueueSnackbar('An error occurred while adding the addresses.', { variant: 'error' });
        } finally {
          setLoading(false);
        }
      };
    
    const updateAddress = async (id: number) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_ADDRESSES}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(addresses),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error updating address:', errorData);
                enqueueSnackbar(errorData.message || 'Failed to update address.', {
                    variant: 'error',
                });
                return
            }
            enqueueSnackbar('Address updated successfully!', { variant: 'success' });
        } catch (error) {
            console.error('Error updating address:', error);
        } finally {
            setLoading(false);
            setShowAddressModal(false);
            setAddresses([
                {
                  address: '',
                  name: '',
                  contact: '',
                }
              ]); 
        }
    };

    const fetchTransactions = async () => {
        try {
          const response = await fetch(API_TRANSACTION, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
      
          // Check for non-200 status codes
          if (!response.ok) {
            const errorData = await response.json(); 
            console.error('Error fetching transactions:', errorData);
            return
          }
      
          const data = await response.json(); 
      
          // Handle empty data
          if (!data || data.length === 0) {
            console.error('No transactions found for the specified user');
            setTransactions([]); // Set to an empty array if no transactions found
            return;
          }
      
          setTransactions(data); // Set the fetched transactions to state
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
    };
    useEffect(() => {
        fetchTransactions()
        fetchAddresesList()
    }, [activeTab])

    const { user } = useAuth()

    const handleReviewPage = (productID: number, checkoutID: string) => {
        router.push(`/add_review/${productID}?checkout_id=${checkoutID}`)
      };

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
                        <PrimaryButton
                            type='button'
                            onClick={() => {setShowAddressModal(true)}}
                        >
                            Add New Address +
                        </PrimaryButton>

                        {showAddressModal && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <div className="w-[506px] mx-auto flex flex-col gap-6 text-xl">                                                                                  
                                        <ModalsAddress
                                            addresses={addresses}
                                            handleInputChange={handleInputChange}
                                            // onClose={() => setShowModal(false)}
                                        />
                                        <div className="w-full flex justify-end gap-4">
                                            <PrimaryButton type="submit" onClick={fetchAddresses}>
                                                {loading ? 'Loading...' : 'Submit'}
                                            </PrimaryButton>
                                            <SecondaryButton
                                                onClick={() => {
                                                    setShowAddressModal(false); 
                                                    setAddresses([
                                                            {
                                                                address: '',
                                                                name: '',
                                                                contact: '',
                                                            }
                                                        ]); 
                                                        }}
                                                type="button"
                                            >
                                                Cancel
                                            </SecondaryButton>
                                        </div>
                               
                                     </div>
                                </div>
                            </div>
                            )}
                    </div>
                    <div className="w-full p-6 flex flex-col gap-8 border-4 border-borderGray rounded-xl text-xl">
                    {Array.isArray(addressListData?.data) && addressListData.data.length > 0 ? (
                        addressListData.data.map((address, index) => (
                        <div key={index} className="w-full flex flex-col gap-4">
                            <div className='gap-8 border-4 border-borderGray rounded-xl p-6'>

                                <div className="w-full flex flex-col">
                                    <span className="font-bold">{address.name}</span>
                                    <span>{address.contact}</span>
                                    <span>{address.address}</span>
                                </div>
                                <div className="w-full flex justify-end gap-3">
                                    <PrimaryButton type="button" className={address.is_main ? 'btn-disabled' : ''} >
                                       {address.is_main ? 'main address' : 'Set As Main'}
                                    </PrimaryButton>
                                    <PrimaryButton 
                                        type="button"   
                                        onClick={() => {
                                            if (address?.id !== undefined) {
                                                getAddressById(address.id);
                                            } else {
                                               enqueueSnackbar("Address not found.", { variant: "error" });
                                            }
                                        }}>
                                        Change
                                    </PrimaryButton>
                                    {showAddressModal && (
                                        <div className="modal-overlay">
                                            <div className="modal-content">
                                                <div className="w-[506px] mx-auto flex flex-col gap-6 text-xl">                                                                                  
                                                    <ModalsAddress
                                                        addresses={addresses}
                                                        handleInputChange={handleInputChange}
                                                        // onClose={() => setShowModal(false)}
                                                    />
                                                    {addresses.map((addressSelected, index) => (
                                                        
                                                    <div key = {index} className="w-full flex justify-end gap-4">
                                                        <PrimaryButton type="submit" onClick={() => {
                                                             if (addressSelected?.id !== undefined) {
                                                                updateAddress(addressSelected.id);
                                                            } else {
                                                               enqueueSnackbar("Address not found.", { variant: "error" });
                                                            }
                                                        }}>
                                                            {loading ? 'Loading...' : 'Submit'}
                                                        </PrimaryButton>
                                                        <SecondaryButton
                                                            onClick={() => {
                                                                setShowAddressModal(false); 
                                                                setAddresses([
                                                                        {
                                                                            address: '',
                                                                            name: '',
                                                                            contact: '',
                                                                        }
                                                                    ]); 
                                                                    }}
                                                            type="button"
                                                        >
                                                            Cancel
                                                        </SecondaryButton>
                                                    </div>
                                                    ))}
                                        
                                                </div>
                                            </div>
                                        </div>
                                        )}

                                    <PrimaryButton type="button">
                                        Delete
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                        ))
                    ) : (
                        <div>No address found</div>
                    )}
                    </div>

                </div>
            </div>
            )}

            {activeTab === 'transactionHistory' && (
                transactions && transactions.length > 0 && transactions?.map((transaction, index) => (
                
                    <div key={index} className='p-6'>
                        <div className='w-full flex flex-col gap-6'>
                            
                            <div className='w-full flex justify-between text-xl'>
                                <div>Find transaction</div>
                            </div>

                            <div className='w-full p-6 flex flex-col gap-8 border-4 border-borderGray rounded-xl text-xl'>
                                <div className='w-full flex gap-8'>
                                    <div className='w-[154px] h-[154px] bg-slate-200'>
                                        <img className='w-full h-full' src={transaction.image_url || "https://placehold.co/600x400"}
                                             alt="https://placehold.co/600x400"
                                        />
                                    </div>

                                    <div className='w-2/3 flex flex-col gap-2'>
                                        <div className='w-full flex gap-4 items-center'>
                                            <span>{convertDate(transaction.created_at)}</span>
                                            <div className='w-auto h-auto p-2 bg-lighterBabyBlue text-buttonBlue text-xs text-center'>{transaction.status}</div>
                                        </div>
                                        <span className='font-bold'>{transaction.name}</span>
                                        <span className='font-bold'>quantity: {transaction.quantity}</span>

                                        <div className='w-full flex gap-3 items-center'>
                                            <img src='/Icon_shop.png'/>
                                            <span className='text-buttonBlue'>{transaction.seller_details.name}</span>
                                        </div>
                                    </div>

                                    <div className='w-1/4 flex flex-col justify-center gap-2'>
                                        <span>Total payment</span>
                                        <span className='font-bold'>{transaction.total_price.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className='w-full flex justify-end gap-3'>
                                    <PrimaryButton 
                                        type='button' 
                                        onClick={() => handleReviewPage(transaction.product_id, transaction.checkout_id)}
                                        disabled={transaction.is_reviewed == true}
                                        >{transaction.is_reviewed == false ? "Add Review +" : "Already Reviewed"}
                                    </PrimaryButton>
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