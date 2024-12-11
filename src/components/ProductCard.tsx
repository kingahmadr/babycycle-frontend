import { ProductModel } from '@/models/Product'
import React from 'react'

// interface ProductCardProps{
//   image: string,
//   name:
// }

export interface ProductCardProps extends Pick<ProductModel, 'name' | 'image_url' | 'price'> {}

const ProductCard:React.FC<ProductCardProps> = ({name, image_url, price}) => {

  return (
    <div className='w-[240px] h-[291px] flex flex-col'>
            <img className='w-full h-[227px] pb-2' src={image_url? image_url: "https://dummyjson.com/image/400x200/008080/ffffff?text=Hello+Peter!&fontSize=16"}/>
            <div className=' w-full h-[64px] flex flex-col gap-1 items-end text-md'>
                <span className='uppercase'>{name}</span>
                <span>IDR {price}</span>
            </div>
    </div>
  )
}

export default ProductCard