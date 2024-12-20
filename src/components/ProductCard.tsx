import { DiscountModel } from '@/models/Discount'
import { ProductModel } from '@/models/Product'
import { finalPrice } from '@/utils/DiscountedPrice';
import React from 'react'

export interface ProductCardProps extends 
  Pick<ProductModel, 'name' | 'image_url' | 'price' | 'stock' > {
    discount?: DiscountModel | null;
  }

const ProductCard:React.FC<ProductCardProps> = ({name, image_url, price, stock, discount}) => {

  const discountedPrice = finalPrice(price,Number(discount?.discount_percentage)||0);

  return (
    <div className='w-[240px] h-[291px] flex flex-col relative'>
      { stock === 0 && (
        <div className='w-auto h-auto bg-black text-white text-xs rounded-xl absolute py-1 px-2 top-2 left-2 uppercase z-10'>
          Out of Stock
        </div>
      )}

      { discount && discount.is_active && (
        <div className='w-auto h-auto bg-black text-white text-xs rounded-xl absolute py-1 px-2 top-2 left-2 uppercase'>
          {Number(discount.discount_percentage).toFixed(0)}% OFF
        </div>
      )}

      { stock === 0 ? (
          <img 
            className='w-full h-[227px] pb-2 saturate-0' 
            src={image_url? image_url: "https://dummyjson.com/image/400x200/008080/ffffff?text=Hello+Peter!&fontSize=16"}/> 
      ) : ( 
          <img 
            className='w-full h-[227px] pb-2' 
            src={image_url? image_url: "https://dummyjson.com/image/400x200/008080/ffffff?text=Hello+Peter!&fontSize=16"}/> 
      )}
            <div className=' w-full h-[64px] flex flex-col gap-1 items-end text-md'>
                <span className='uppercase'>{name}</span>

      { stock !== 0 ? (

        <div className='w-full flex justify-end items-center space-x-2'>
          <span className={discount && discount.is_active? 'line-through text-xs' : 'no-underline'}>IDR {price}</span>
          { discount && discount.is_active && (
            <span className="text-dangerRed font-bold">
              IDR {discountedPrice.toLocaleString()}
            </span>
          )}
        </div>
      ): (
        <div></div>
      )}

      </div>          
    </div>
  )
}

export default ProductCard