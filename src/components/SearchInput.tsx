import React, { useState } from 'react'
import Image from 'next/image'

const SearchInput = () => {
  const [isSearchActive, setIsSearchActive] = useState(false)

  return (
    <div className='relative flex items-center'>
      {/* Search Icon or Button */}
      <button onClick={() => setIsSearchActive(true)}>
        <Image
          src='/assets/search.png'
          alt='Search Icon'
          width={50}
          height={50}
          className='cursor-pointer'
        />
      </button>

      {/* Expanding Search Input */}
      <div
        className={`absolute left-full ml-2 flex items-center transition-all duration-300 ${
          isSearchActive ? 'w-[200px] opacity-100' : 'w-0 opacity-0'
        } overflow-hidden`}
      >
        <input
          type='text'
          placeholder='Search products...'
          className={`border border-textBlue px-4 py-2 rounded-lg text-textGray ${
            isSearchActive && 'focus:border-3 focus:outline-none'
          } w-full z-20`}
          autoFocus={isSearchActive}
        />
      </div>

      {/* Overlay */}
      {isSearchActive && (
        <div
          className='fixed inset-0 bg-black bg-opacity-40 z-10'
          onClick={() => setIsSearchActive(false)}
        ></div>
      )}
    </div>
  )
}

export default SearchInput
