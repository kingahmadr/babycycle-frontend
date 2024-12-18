import ProductCard from '@/components/ProductCard'
import { PrimaryButton } from '@/components/PrimaryButton'
// import useFetch from '@/hooks/useFetch'
import { ProductModel } from '@/models/Product'
import { DataWithCount } from '@/models/DataWithCount'
import { GetStaticProps } from 'next'

interface HomeProps {
  fetchedData: DataWithCount<ProductModel>
}

const Home = ({ fetchedData }: HomeProps) => {
  // const { data: fetchedData } = useFetch<DataWithCount<ProductModel>>({
  //   endpoint: 'https://api.babycycle.my.id/api/v1/products'
  // })

  return (
    <>
      <div className='h-[660px] bg-babyBlue flex -z-10 object-contain relative w-full'>
        <div className='w-full'>
          <img
            className='absolute top-[55px] left-[180px] z-[3]'
            src='/image_2.png'
          />
          <img
            className='absolute top-[96px] left-[144px] z-[1]'
            src='/Rectangle_42.png'
          />
          <img className='absolute top-0 right-0 z-[5]' src='/asset3_1.png' />
          <img className='absolute' src='/asset2_2.png' />
          <img className='absolute bottom-0 right-0' src='/asset2_1.png' />
          <img className='absolute bottom-0 z-[5]' src='/asset1_1.png' />
        </div>

        <div className='w-1/2 flex flex-col justify-center items-center gap-6 z-0'>
          <span className='font-decor text-4xl'>Smart mom, shop recycle</span>
          <PrimaryButton type='button'>Explore</PrimaryButton>
        </div>
      </div>
      <div className='body-width'>
        <div className='flex gap-6 py-16'>
          <div className='w-[240px] h-[291px] flex flex-col gap-around'>
            <span className='h-1/2 uppercase text-6xl'>Sale & Promo</span>
            <div className='h-1/2 flex justify-center items-center'>
              <PrimaryButton type='button'>See All</PrimaryButton>
            </div>
          </div>
          {fetchedData?.data ? (
            fetchedData.data
              .slice(0, 4)
              .map((product, index) => (
                <ProductCard
                  key={index}
                  image_url={product.image_url}
                  name={product.name}
                  price={product.price} stock={0}                />
              ))
          ) : (
            <p>No products available</p>
          )}
        </div>

        <div className='flex gap-6 py-16'>
          {fetchedData?.data ? (
            fetchedData.data
              .slice(0, 4)
              .map((product, index) => (
                <ProductCard
                  key={index}
                  image_url={product.image_url}
                  name={product.name}
                  price={product.price} stock={0}                />
              ))
          ) : (
            <p>No products available</p>
          )}
          <div className='w-[240px] h-[291px] flex flex-col gap-around'>
            <span className='h-1/2 uppercase text-6xl'>New Arrival</span>
            <div className='h-1/2 flex justify-center items-center'>
              <PrimaryButton type='button'>See All</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch('https://api.babycycle.my.id/api/v1/products')
  const fetchedData: DataWithCount<ProductModel> = await response.json()

  return {
    props: {
      fetchedData
    },
    revalidate: 60
  }
}
