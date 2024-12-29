import { PrimaryButton } from '@/components/PrimaryButton'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { TransactionModel } from '@/models/Transactions'
import { API_TRANSACTION, API_ADDRESSES, API_ADDRESSES_MAIN, API_PROFILE_IMAGE, API_UPDATE_PROFILE } from '@/constants/apis'
import { useRouter } from 'next/navigation'
import { convertDate } from "@/utils/formatDate";
import { SecondaryButton } from '@/components/SecondaryButton'
import { enqueueSnackbar } from "notistack";
import { AddressModel } from '@/models/Address'
import { DataWithCount } from '@/models/DataWithCount'
import  Modals from '@/components/Modals'
import LoadingSpinner from '@/components/LoadingSpinner'
import { uploadFile } from "@/utils/uploadFile";
import { UserModel } from '@/models/User'

const UserDashboard = () => {

    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('personalData')
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showUserProfileUpdateModal, setShowUserProfileUpdateModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [updatingAddressId, setUpdatingAddressId] = useState<number | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [images, setImage] = useState<File | null>(null);
    const [profileData, setProfileData] = useState<UserModel>({
        username: user?.data.username || "",
        email: user?.data.email || "",
        phone: user?.data.phone || "",
      });

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

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0]; // Get the selected file directly
        
            try {
            const fileUrl = await uploadFile(
                { fileName: file.name, file }, // Use the selected file
                enqueueSnackbar
            );
            console.log("Uploaded file URL:", fileUrl);
            enqueueSnackbar(`File available at: ${fileUrl}`, { variant: "info" });
            setImageUrl(fileUrl); // Update the image URL state
            setImage(file);
            } catch (error) {
            console.error("Upload failed:", error);
            }
        } else {
            enqueueSnackbar("Please select a file to upload.", { variant: "warning" });
        }
    };
    const handlePromptUpload = () => {
        const input = document.getElementById("imageInput") as HTMLInputElement;
        input?.click();
      };
    
      const handleImageRemove = () => {
        enqueueSnackbar("Are you sure you want to delete this image?", {
          variant: "warning",
          action: () => (
            <button
              onClick={() => {
                setImage(null);
                setImageUrl("");
                enqueueSnackbar("Image deleted successfully!", {
                  variant: "success",
                });
              }}
            >
              Confirm
            </button>
          ),
        });
      };
    
    

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
    const handleProfileChange = (field: string, value: string) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
          }));
      };
    
    const updateProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_UPDATE_PROFILE, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ 
                    username: profileData.username,
                    email: profileData.email,
                    phone: profileData.phone 
                
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error updating profile:', errorData);
                enqueueSnackbar(errorData.message || 'Failed to update profile.', {
                    variant: 'error',
                });
                return
            }
            // const data = await response.json();
            enqueueSnackbar('Profile updated successfully!', {
                variant: 'success',
            });
            // setProfileData(data);
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
            setShowUserProfileUpdateModal(false)
        }
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

    const getAddressToDelete = async (id: number) => {
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
            setShowDeleteModal(true)
            
        } catch (error) {
            console.error('Error updating address:', error);
        }
    }

    const handleDeleteAddress = async (id: number) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_ADDRESSES}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error deleting address:', errorData);
                enqueueSnackbar(errorData.message || 'Failed to delete address.', {
                    variant: 'error',
                });
                return
            }
            enqueueSnackbar('Address deleted successfully!', { variant: 'success' });
        } catch (error) {
            console.error('Error deleting address:', error);
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
            setAddresses([
                {
                  address: '',
                  name: '',
                  contact: '',
                }
              ]); 
        }
       
    }

    const changeProfileImage = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_PROFILE_IMAGE, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    profile_image: imageUrl
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error updating address:', errorData);
                enqueueSnackbar(errorData.message || 'Failed to update address.', {
                    variant: 'error',
                });
                return
            }
            enqueueSnackbar('Profile image updated successfully!', { variant: 'success' });
        }
        catch (error) {
            console.error('Error updating address:', error);
        } finally {
            setLoading(false);
        }
    }

    const setAsMain = async (id: number) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_ADDRESSES_MAIN}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error set address as main:', errorData);
                enqueueSnackbar(errorData.message || 'Error set address as main.', {
                    variant: 'error',
                });
                return
            }
            enqueueSnackbar('Address set as main!', { variant: 'success' });
        } catch (error) {
            console.error('Error updating address:', error);
        } finally {
            setLoading(false);
        }
    }

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
    }, [activeTab, showAddressModal, loading])

    
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

                    {/* <div className='w-[450px] h-[450px]'>
                        <img className='w-full h-full' src=''></img>
                    </div> */}
                    <div className="flex flex-col space-y-4 w-full lg:w-1/2">
                        {/* Main Image */}
                        <div
                            className="bg-gray-300 relative max-w-[600] flex justify-center items-center cursor-pointer hover:bg-gray-400 rounded-lg min-h-[500] min-w-[500]"
                            onClick={handlePromptUpload}
                            >
                        {images ? (
                            <div className="relative w-full h-full">
                            <img
                                src={URL.createObjectURL(images)} // Display the selected image
                                alt=""
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                                className="absolute bottom-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                onClick={(e) => {
                                e.stopPropagation();
                                handleImageRemove();
                                }}
                            >
                                Remove
                            </button>
                            </div>
                        ) : user?.data.profile_image ? (
                            <img
                                src={user?.data.profile_image} // Display the selected image
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) :(
                            <p className="text-gray-500 text-lg">Select photos</p>
                        )}
                        </div>
                        <input
                        type="file"
                        id="imageInput"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        />
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
                            <PrimaryButton 
                                    type='button'
                                    onClick={changeProfileImage}
                                    >{loading ? 'Loading...' : 'Change Profile Image'}
                            </PrimaryButton>
                            <PrimaryButton onClick={() => {setShowUserProfileUpdateModal(true)}} type='button'>Change Data</PrimaryButton>
                            {showUserProfileUpdateModal && (
                                <div className="modal-overlay">
                                    <div className="modal-content-flexible bg-white top-[40%]">
                                        {!loading ? (
                                            <div className="w-[506px] mx-auto flex flex-col gap-6 text-xl">
                                            <Modals 
                                            type="userProfile" 
                                            profile_data={{
                                                username: profileData.username || "",
                                                email: profileData.email || "",
                                                phone: profileData.phone || "",
                                            }}
                                            handleInputChange={handleProfileChange}
                                            onCancel={() => setShowUserProfileUpdateModal(false)}
                                            onConfirm={updateProfile}
                                            />
                                        </div>
                                        ) : (
                                            <LoadingSpinner className='w-[100px] h-[100px] mx-auto'/>
                                        )}   
                                            
                                    </div>
                                </div>
                            )}
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
                                        <Modals
                                            type='address'
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
                                    <PrimaryButton 
                                        onClick={() => {
                                            if (address?.id !== undefined) {
                                                setUpdatingAddressId(address.id); // Set the updating address ID
                                                setAsMain(address.id)
                                            }
                                        }}
                                        type="button" 
                                        className={address?.is_main ? 'btn-disabled' : ''} 
                                        disabled={address?.is_main || updatingAddressId === address?.id} // Disable if already main or updating this address
                                    >
                                        {updatingAddressId === address?.id && loading
                                            ? 'Loading...' 
                                            : address?.is_main 
                                                ? 'Main Address' 
                                                : 'Set As Main'}
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
                                                    <Modals
                                                        type='address'
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
                                    <PrimaryButton 
                                         onClick={() => {
                                            if (address?.id !== undefined) {
                                                getAddressToDelete(address.id);
                                            } else {
                                               enqueueSnackbar("Address not found.", { variant: "error" });
                                            }
                                        }}
                                        type="button">
                                            Delete
                                    </PrimaryButton>
                                    {showDeleteModal && (
                                        <div className="modal-overlay">
                                            <div className="modal-content-flexible top-[40%]">
                                                {!loading ? (
                                                    addresses.map((addressSelected, index) => (
                                                        <div className="w-[506px] mx-auto flex flex-col gap-6 text-xl bg-white p-6 rounded-xl">
                                                            <Modals
                                                            key={index}
                                                            type="confirmation"
                                                            onConfirm={() => {
                                                                if (addressSelected?.id !== undefined) {
                                                                handleDeleteAddress(addressSelected.id);
                                                                }
                                                            }}
                                                            onCancel={() => setShowDeleteModal(false)}
                                                            />
                                                         </div>
                                                        ))
                                                    ) : (
                                                    <LoadingSpinner className='w-[100px] h-[100px] mx-auto'/>
                                                    )}
                                            </div>
                                        </div>
                                        )}
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