import { DiscountModel } from '@/models/Discount'
import { ProductModel } from '@/models/Product'
import { finalPrice } from '@/utils/DiscountedPrice';
import Link from 'next/link';
import React from 'react'

export interface ProductCardProps extends 
  Pick<ProductModel, 'id' | 'name' | 'image_url' | 'price' | 'stock' > {
    discount?: DiscountModel | null;
  }

const ProductCard:React.FC<ProductCardProps> = ({id, name, image_url, price, stock, discount}) => {

  const discountedPrice = finalPrice(price,Number(discount?.discount_percentage)||0);

  return (
    <Link href={`/product/${id}`}>

      <div className='lg:w-full lg:h-[200px] flex flex-col relative md:w-auto md:h-[291px] xl:w-[200px] xl:h-[291px] mobile:w-[200px] mobile:h-[200px] mobile:mx-auto'>
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
              src={image_url? image_url: "https://dummyjson.com/image/400x200/008080/ffffff?text=Products!&fontSize=16"}/> 
        ) : ( 
            <img 
              className='w-full h-[227px] pb-2' 
              src={image_url? image_url: "https://dummyjson.com/image/400x200/008080/ffffff?text=Products!&fontSize=16"}/> 
        )}
              <div className=' w-full h-[64px] flex flex-col gap-1 items-end lg:text-md md:text-sm'>
                  <span className='uppercase'>{name}</span>

        { stock !== 0 ? (

          <div className='w-full flex justify-end items-center space-x-2 md:text-sm lg:text-md py-2'>
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
    </Link>
  )
}

export default ProductCard