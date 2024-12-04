import React from 'react'

function ProductCard() {
  return (
    <div className='w-[240px] h-[291px] flex flex-col'>
            <img className='w-full h-[227px] pb-2' src=""/>
            <div className=' w-full h-[64px] flex flex-col gap-1 items-end text-md'>
                <span className='uppercase'>Product Name</span>
                <span>IDR 999999</span>
            </div>
    </div>
  )
}

export default ProductCard