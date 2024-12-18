import { PrimaryButton } from '@/components/PrimaryButton'
import { SecondaryButton } from '@/components/SecondaryButton'
import React, { useState } from 'react'

function Index() {

    const [rating, setRating] = useState<number>(0)
    const [hoverRating, setHoverRating] = useState<number>(0)

    const handleStarHover = (index: number) => {
        setHoverRating(index)
    }

    const handleStarClick = (index: number) => {
        setRating(index)
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

                        <div>
                            <span className='text-3xl font-extrabold'>Furnibest Stroller Baby Travel</span>
                        </div>

                        <div className='w-full flex flex-col gap-2'>
                            <span className='text-formGray text-xl'>How would you rate the product?</span>
                            <div className='w-auto flex space-x-1'>
                                {renderStars()}
                            </div>
                        </div>

                        <div className='w-full flex flex-col space-y-3'>
                            <label className='text-buttonBlue'>Write a review of this product</label>
                            <input className='w-4/5 h-60 border-2 border-formGray rounded-md' type='textarea'></input>
                        </div>
                                

                        <div className='w-full flex justify-end gap-6 text-xl'>
                            <PrimaryButton type='button'>Add Review</PrimaryButton>
                            <SecondaryButton type='button'>Cancel</SecondaryButton>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
  )
}

export default Index