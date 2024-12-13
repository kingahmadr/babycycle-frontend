import { PrimaryButton } from '@/components/PrimaryButton';
import ProductCard from '@/components/ProductCard'
import useFetch from '@/hooks/useFetch';
import { DataWithCount } from '@/models/DataWithCount';
import { DiscountModel } from '@/models/Discount';
import { ProductModel } from '@/models/Product';
import { useEffect, useState } from 'react'

function Index() {

    const {data: fetchedData } = useFetch<DataWithCount<ProductModel>>({
      endpoint: 'https://api.babycycle.my.id/api/v1/products'
    })

    const [discounts, setDiscounts] = useState<{ [key: number]: DiscountModel | null }>({})

    const getDiscount = async (id: number) => {
      const response = await fetch(`https://api.babycycle.my.id/api/v1/discount/${id}`)
      const discountData: DiscountModel = await response.json();
      return discountData;
    }

    console.log(getDiscount(11))

    // const getDiscount = (id: number) => {
    //   const { data: discountData } = useFetch<DiscountModel>({
    //     endpoint: `https://api.babycycle.my.id/api/v1/discount/${id}`,
    //   })

    //   return discountData
    // }

    const fetchDiscounts = async (products: ProductModel[]) => {
      const productDiscounts = await Promise.all(
        products.map(async (product) => {
          const discountData = await getDiscount(product.id);
          return { id: product.id, discountData };
        })
      );
    
      const discountMap: { [key: number]: DiscountModel | null } = {};
      productDiscounts.forEach(({ id, discountData }) => {
        discountMap[id] = discountData;
      });
      if (discountMap !== null) {
        setDiscounts(discountMap);
      }
    };

    useEffect(() => {
      if (fetchedData?.data) {
        fetchDiscounts(fetchedData.data);
      }
    }, [fetchedData]); 


    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
      setIsOpen(true)
    };

    const [selectedOption, setSelectedOption] = useState('HIGHEST PRICE')
  
    const handleSelect = (option: any) => {
      setSelectedOption(option)
      setIsOpen(false)
    };

  return (
    <div className='body-width flex'>
      <div className='w-72 uppercase py-3 flex flex-col gap-6'>
        <div className='text-xl text-buttonBlue'>All Filters</div>

        <div className='flex flex-col gap-2 px-3'>
          <div>Product Type</div>
          <div className='flex flex-col gap-1 text-sm'>
            <label className='flex gap-2 items-center'>
              <input type="checkbox"
                name="category"
                value="clothing"/>
              <span>Clothing</span>
            </label>
            <label className='flex gap-2 items-center'>
              <input type="checkbox"
                name="category"
                value="furniture"/>
              <span>furniture</span>
            </label>
            <label className='flex gap-2 items-center'>
              <input type="checkbox"
                name="category"
                value="stroller_and_carrier"/>
              <span>stroller & carrier</span>
            </label>
            <label className='flex gap-2 items-center'>
              <input type="checkbox"
                name="category"
                value="toys"/>
              <span>toys</span>
            </label>
            <label className='flex gap-2 items-center'>
              <input type="checkbox"
                name="category"
                value="others"/>
              <span>others</span>
            </label>
          </div>
        </div>

        <div className='flex flex-col gap-2 px-3'>
          <div>warranty</div>
          <div className='flex flex-col gap-1 text-sm'>
            <label className='flex gap-2 items-center'>
              <input type="radio"
                name="warranty"
                value="yes"/>
              <span>yes</span>
            </label>
            <label className='flex gap-2 items-center'>
              <input type="radio"
                name="warranty"
                value="no"/>
              <span>no</span>
            </label>
          </div>
        </div>

        <div className='flex flex-col gap-2 px-3'>
          <div>Age Category</div>
          <div className='flex flex-col gap-1 text-sm'>
            <label className='flex gap-2 items-center'>
              <input type="checkbox"
                name="age_category"
                value="0-2"/>
              <span>0-2</span>
            </label>
            <label className='flex gap-2 items-center'>
              <input type="checkbox"
                name="age_category"
                value="3-5"/>
              <span>3-5</span>
            </label>
            <label className='flex gap-2 items-center'>
              <input type="checkbox"
                name="age_category"
                value="all_ages"/>
              <span>all ages</span>
            </label>
          </div>
        </div>

        <div className='pt-8'>
          <PrimaryButton type='button'>Apply</PrimaryButton>
        </div>

      </div>



      <div className='w-full'>
        <div className='uppercase text-[14px] h-auto py-3 flex justify-end items-center'>
          <div className='flex items-center gap-3'>

            <span className='text-buttonBlue'>Sort By</span>
            <button className="w-60 h-8 flex justify-between items-center bg-white text-black border-black border-2 rounded-none px-4 text-left" onClick={toggleDropdown}>
              {selectedOption} 
              <img src="/Polygon_1.png"/>
            </button>
          </div>

        {isOpen && (
          <div className='relative z-20'>
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

        {isOpen && (
          <div
            className='fixed inset-0 bg-transparent bg-opacity-40 z-10'
            onClick={() => setIsOpen(false)}
          ></div>
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
        {fetchedData && fetchedData.data.map((product, index) => {
            const discountData = discounts[product.id]

            return (
              <ProductCard
                key={index}
                image_url={product.image_url}
                name={product.name}
                price={product.price}
                stock={product.stock}
                discount={discountData}
              />
            );
          })}
        </div>
        <div>
          <div className='flex justify-end space-x-6 py-8'>
            <div>
              <img src='/Polygon_2.png'/>
            </div>
            <div>1</div>
            <div>
              <img src='/Polygon_3.png'/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index