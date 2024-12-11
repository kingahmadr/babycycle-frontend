import { PrimaryButton } from '@/components/PrimaryButton'
import { SecondaryButton } from '@/components/SecondaryButton'
import React from 'react'

const AddAddressPage = () => {
  return (
    <div className='body-width mb-[72px] max-md:w-full max-md:px-8'>
        
        <div className='h-auto border-[1px] rounded-[20px] border-buttonBlue my-9'>
            <div className='flex gap-14 px-6 py-8 text-3xl text-buttonBlue'>
                <span>Add Address</span>
            </div>

            <hr className='h-[3px] bg-buttonBlue'></hr>

            <div className='w-full p-6 flex justify-center'>
                <div className='w-[506px] flex flex-col gap-6 text-xl'>

                    <div className='w-full space-y-1'>
                        <label className='text-buttonBlue'>Name</label>
                        <input className='w-full h-10 border-2 border-formGray rounded-md' type='text'></input>
                    </div>
                    <div className='w-full space-y-1'>
                        <label className='text-buttonBlue'>Contact Number</label>
                        <input className='w-full h-10 border-2 border-formGray rounded-md' type='text'></input>
                    </div>
                    <div className='w-full space-y-1'>
                        <label className='text-buttonBlue'>Address</label>
                        <input className='w-full h-40 border-2 border-formGray rounded-md' type='text'></input>
                    </div>

                    <div className='w-full flex justify-end gap-6 text-xl'>
                        <PrimaryButton type='button'>Add Address</PrimaryButton>
                        <SecondaryButton type='button'>Cancel</SecondaryButton>
                    </div>

                </div>
            </div>
        
        </div>

    </div>

  )
}

export default AddAddressPage