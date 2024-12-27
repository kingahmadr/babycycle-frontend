import React, { use, useEffect, useState } from 'react'
import { PrimaryButton } from '@/components/PrimaryButton'
import { SecondaryButton } from '@/components/SecondaryButton'
// import { ReviewModel } from '@/models/Reviews'
import { API_REVIEW, API_GET_PRODUCT } from '@/constants/apis'
import { useRouter } from "next/router";
import { enqueueSnackbar } from 'notistack'
import { useAuth } from '@/context/AuthContext';
import { ProductModel } from '@/models/Product';

const AddReviewProduct = () => {

    const [rating, setRating] = useState<number>(0)
    const [hoverRating, setHoverRating] = useState<number>(0)
    const [review, setReview] = useState('');
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState<ProductModel[]>([]);

    const router = useRouter();
    const { productID, checkoutID } = router.query

    // console.log(review)
    // console.log(productID, checkoutID)

    // const {isAuthenticated} = useAuth()

    useEffect(() => {
        // if (!isAuthenticated) {
        //     enqueueSnackbar('You must be logged in to add a review', {
        //         variant: "error",
        //     })
        //     router.push('/login')
        // }

        if (productID && checkoutID) {
            fetchProduct(Number(productID))
        }


    }, [productID, checkoutID])

    console.log('productData', productData)
    console.log('product data name', (productData.length >= 0 && productData.map(product => product.price)));

    const fetchProduct = async (id: number) => {
        try {
          const response = await fetch(`${API_GET_PRODUCT}/${id}`, {
            method: 'GET',
          });
      
          const data = await response.json();
      
          if (!response.ok) {
            console.error('Error response:', data); // Log the error data
            enqueueSnackbar(data.error || 'Failed to fetch product', {
              variant: "error",
            })
            return
            // throw new Error(data.error || 'Failed to fetch product'); // Provide meaningful error message
          }
          setProductData(data);
      
          // Perform additional actions on success (e.g., updating UI)
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };

    const reviewPayload = {
        product_id: productID,
        rating: rating,
        review: review,
        checkout_order_id: checkoutID
    }
    const fetchCreateReview = async () => {
        setLoading(true);
        console.log('reviewPayload', reviewPayload)
        try {

          const response = await fetch(`${API_REVIEW}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(reviewPayload),
          });
      
          const data = await response.json();
      
          if (!response.ok) {
            // console.error('Error response:', data); // Log the error data
            enqueueSnackbar(data.error || 'Failed to create review', {
              variant: "error",
            })
            return
            // throw new Error(data.error || 'Failed to create review'); // Provide meaningful error message
          }
      
          enqueueSnackbar('Review has been posted!', {
            variant: "success",
          });
          // Perform additional actions on success (e.g., updating UI)
          router.push('/dashboard')
        } catch (error) {
          console.error('Error creating review:', error);
        } finally {
          setLoading(false); // Ensure loading state is cleared
        }
      };
    

    const handleSubmit = () => {
        fetchCreateReview()
    }

    const handleStarHover = (index: number) => {
        setHoverRating(index)
    }

    const handleStarClick = (index: number) => {
        setRating(index)
    };

    const handleChangeReview = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReview(e.target.value); // Update state when the text area value changes
      };
    
    const renderStars = () => {
        return [...Array(5)].map((_, index) => (
        <img
            key={index}
            src="/Star_review.png"
            className={`w-16 h-16 cursor-pointer transition-all ${(index < rating || index < hoverRating) ? 'saturated' : 'unsaturated'}`}
            onMouseEnter={() => handleStarHover(index + 1)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleStarClick(index + 1)}
            alt={`star ${index}`}
        />
        ))
    }

  return (
       <div className='body-width mb-[72px] max-md:w-full max-md:px-8'>
           <div className='h-auto border-[1px] rounded-[20px] border-buttonBlue my-9'>
               <div className='flex gap-14 px-6 py-8 text-3xl text-buttonBlue'>
                   <span>Add Review</span>
               </div>
   
               <hr className='h-[3px] bg-buttonBlue'></hr>
   
               <div className='p-6'>
                   <div className='w-full flex gap-8'>
   
                       <div className='w-[222px] h-[222px]'>
                           <img className='w-full h-full' src=''></img>
                       </div>
   
                       <div className='w-4/5 flex flex-col gap-8'>
   
                           <div className='w-full flex justify-between'>
                               <div className='w-full flex gap-3 items-center'>
                                   <span>25 October 2024</span>
                                   <div className='w-auto h-auto p-2 bg-lighterBabyBlue text-buttonBlue text-xs text-center'>Done</div>
                               </div>
                               <div className='w-full flex gap-3 justify-end items-center'>
                                   <img src='/Icon_shop.png'/>
                                   <span className='text-buttonBlue'>BabyStuffID</span>
                               </div>
                           </div>
                           {Array.isArray(productData) && productData.length ? (
                                productData.map((product, index) => (
                                    <div key={index}>
                                    <span className="text-3xl font-extrabold">{product.name || 'Placeholder Name'}</span>
                                    </div>
                                ))
                                ) : (
                                <div>
                                    <span className="text-3xl font-extrabold">No products available</span>
                                </div>
                            )}

                            {/* <div>
                                <span className='text-3xl font-extrabold'>PlaceHolder Name</span>
                                </div>
                            */}
                           <div className='w-full flex flex-col gap-2'>
                               <span className='text-formGray text-xl'>How would you rate the product?</span>
                               <div className='w-auto flex space-x-1'>
                                   {renderStars()}
                               </div>
                           </div>
   
                           <div className='w-full flex flex-col space-y-3'>
                           <label className="text-buttonBlue">Write a review of this product</label>
                                <textarea
                                    className="w-4/5 h-60 border-2 border-formGray rounded-md"
                                    value={review}
                                    onChange={handleChangeReview} // Properly typed event handler
                                    placeholder="Type your review here..."
                                ></textarea>
                           </div>
                                   
   
                           <div className='w-full flex justify-end gap-6 text-xl'>
                               <PrimaryButton 
                                   onClick={handleSubmit} 
                                   type='button'>
                                     {loading ? 'Loading...' : 'Add Review'}
                                </PrimaryButton>
                               <SecondaryButton 
                                    type='button'
                                    onClick={() => router.push('/dashboard')}
                                    >Cancel                                 
                                </SecondaryButton>
                           </div>
                       </div>
   
                   </div>
               </div>
           </div>
       </div>
     )
  
}

export default AddReviewProduct



