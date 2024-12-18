import ProductCard from '@/components/ProductCard'
import { PrimaryButton } from '@/components/PrimaryButton'
import { useEffect, useState } from 'react'
import { ProductModel } from '@/models/Product'
import { DataWithCount } from '@/models/DataWithCount'
import { GetStaticProps } from 'next'
import { DiscountModel } from '@/models/Discount'

import { useRouter } from 'next/navigation'
import Spinner from '@/components/Spinner'
import { PAGE_LISTING } from '@/constants/pages'

interface ProductsProps {
  newProducts: DataWithCount<ProductModel>,
  saleProducts: DataWithCount<ProductModel>
}

const Home = ({ newProducts, saleProducts }: ProductsProps) => {

  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [discounts, setDiscounts] = useState<{ [key: number]: DiscountModel | null }>({})

  const getDiscount = async (id: number) => {
      const response = await fetch(`https://api.babycycle.my.id/api/v1/discount/${id}`)
      const discountData: DiscountModel = await response.json();
      return discountData;
    }

    const fetchDiscounts = async (products: ProductModel[]) => {
      const productDiscounts = await Promise.all(
        products.map(async (product) => {
          const discountData = await getDiscount(product.id);
          return { id: product.id, discountData };
        })
      )
    
      const discountMap: { [key: number]: DiscountModel | null } = {}
      productDiscounts.forEach(({ id, discountData }) => {
        discountMap[id] = discountData
        setLoading(false)
      })
      if (discountMap !== null) {
        setDiscounts(discountMap)
      }
    } 

  useEffect(() => {
    if (saleProducts?.data.length > 0) {
      fetchDiscounts(saleProducts.data)
    }
  }, [saleProducts])

  const handleClick = (href: string) => {
    router.push(href)
  }

  return (
    <div>

      <div className='h-[660px] bg-babyBlue flex -z-10 object-contain relative w full'>
        <div className='w-1/2'>
          <img className='absolute top-[55px] left-[180px] z-[3]' src='/image_2.png'/>
          <img className='absolute top-[96px] left-[144px] z-[1]' src='/Rectangle_42.png'/>
          <img className='absolute top-0 right-0 z-[5]' src='/asset3_1.png'/>
          <img className='absolute' src='/asset2_2.png'/>
          <img className='absolute bottom-0 right-0' src='/asset2_1.png'/>
          <img className='absolute bottom-0 z-[5]' src='/asset1_1.png'/>
        </div>
        
        <div className='w-1/2 flex flex-col justify-center items-center gap-6 z-50'>
          <span className='font-decor text-4xl'>Smart mom, shop recycle</span>

            <PrimaryButton type='button' onClick={() => handleClick(PAGE_LISTING)}>Explore</PrimaryButton>

        </div>
      </div>

      <div className='flex gap-6 py-16'>
        <div className='w-[240px] h-[291px] flex flex-col gap-around'>
          <span className='h-1/2 uppercase text-6xl'>Sale & Promo</span>
          <div className='h-1/2 flex justify-center items-center'>
            <PrimaryButton type='button' onClick={() => handleClick(PAGE_LISTING)}>See All</PrimaryButton>
          </div>
        </div>
        {loading ? (
            <div className='w-full h-56 flex justify-center items-center'>
                <Spinner />
            </div>
        ) : ( 
          saleProducts && saleProducts.data.map((product, index)=>(
          discounts[product.id] && discounts[product.id]?.is_active && product.stock !== 0 ?
            <ProductCard
              id={product.id}
              key={index}
              image_url={product.image_url}
              name={product.name}
              price={product.price}
              stock={product.stock}
              discount={discounts[product.id]}
            /> : null
          )
        ))}
        </div>

      <div className='flex gap-6 py-16'>
      {newProducts && newProducts.data.map((product, index)=>(
          <ProductCard
            id={product.id}
            key={index}
            image_url={product.image_url}
            name={product.name}
            price={product.price}
            stock={product.stock}
          />
        ))}        
        <div className='w-[240px] h-[291px] flex flex-col gap-around'>
          <span className='h-1/2 uppercase text-6xl'>New Arrival</span>
          <div className='h-1/2 flex justify-center items-center'>
            <PrimaryButton type='button' onClick={() => handleClick(PAGE_LISTING)}>See All</PrimaryButton>
          </div>
        </div>
      </div>

    </div>
  )
}


export const getStaticProps: GetStaticProps = async () => {

  let newProducts: DataWithCount<ProductModel> = { data: [], total_count: 0 }
  let saleProducts: DataWithCount<ProductModel> = { data: [], total_count: 0 }

  try {
      const response = await fetch(`https://api.babycycle.my.id/api/v1/products/sorting?limit=4&offset=0&sort_by=newest`)
      if (!response.ok) throw new Error('Failed to fetch')
      newProducts = await response.json()

      const saleResponse = await fetch(`https://api.babycycle.my.id/api/v1/products`)
      if (!saleResponse.ok) throw new Error('Failed to fetch sale products')
      saleProducts = await saleResponse.json()

      console.log(saleProducts)

  } catch (error) {
      console.error(error)
  }

  return {
      props: {
          newProducts,
          saleProducts
      }
  }
}

export default Home
