import ProductCard from '@/components/ProductCard'
import React, { useState } from 'react'

function index() {

    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
      setIsOpen(true)
    };

    const [selectedOption, setSelectedOption] = useState('HIGHEST PRICE')
  
    const handleSelect = (option) => {
      setSelectedOption(option)
      setIsOpen(false)
    };

  return (
    <div className='w-[1440px] flex'>
      <div className='w-1/4'>
        All Filters
      </div>
      <div className='w-3/4'>
        <div className='uppercase text-[14px] h-auto py-3 flex justify-end items-center'>
          <div className='flex items-center gap-3'>

            <span className='text-buttonBlue'>Sort By</span>
            <button className="w-60 h-8 flex justify-between items-center bg-white text-black border-black border-2 rounded-none px-4 text-left" onClick={toggleDropdown}>
              {selectedOption} 
              <img src="/Polygon 1.png"/>
            </button>
          </div>

        {isOpen && (
          <div className='relative'>
            <div className="absolute w-60 h-auto top-4 right-0 bg-white border-none rounded-none z-10">
              <ul>
                <li className="px-4 py-2 hover:bg-buttonBlue hover:text-white cursor-pointer"
                    onClick={() => handleSelect('HIGHEST PRICE')}>
                  Highest Price
                </li>
                <li className="px-4 py-2 hover:bg-buttonBlue hover:text-white cursor-pointer"
                    onClick={() => handleSelect('LOWEST PRICE')}>
                  Lowest Price
                </li>
                <li className="px-4 py-2 hover:bg-buttonBlue hover:text-white cursor-pointer"
                    onClick={() => handleSelect('NEWEST')}>
                  Newest
                </li>
                <li className="px-4 py-2 hover:bg-buttonBlue hover:text-white cursor-pointer"
                    onClick={() => handleSelect('DISCOUNT')}>
                  Discount
                </li>         
              </ul>
            </div>
          </div>
        )}
          {/* <label className='flex'><span className='text-buttonBlue'>Sort By</span>
            <select className='w-60 h-8 bg-white text-black  border-black border-2 rounded-none uppercase px-4'>
              <option className='' value="highestPrice">Highest Price</option>
              <option className='' value="lowestPrice">Lowest Price</option>
              <option className='' value="newest">Newest</option>
              <option className='' value="discount">Discount</option>
            </select>
          </label> */}
        </div>
        <div className='flex flex-wrap justify-end gap-6'>
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>

          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>

          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>

          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>

          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
        </div>
        <div>
          page
        </div>
      </div>
    </div>
  )
}

export default index