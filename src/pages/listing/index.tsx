import ProductCard from '@/components/ProductCard'
import React from 'react'

function index() {
  return (
    <div className='w-[1440px] flex'>
      <div className='w-1/5'>
        All Filters
      </div>
      <div className='w-4/5'>
        <div>
          Sort
        </div>
        <div className='flex flex-wrap gap-6'>
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