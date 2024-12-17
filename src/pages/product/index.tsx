import { PrimaryButton } from '@/components/PrimaryButton';
import ProductCard from '@/components/ProductCard'
import Spinner from '@/components/Spinner';
import useFetch from '@/hooks/useFetch';
import { DataWithCount } from '@/models/DataWithCount';
import { DiscountModel } from '@/models/Discount';
import { ProductModel } from '@/models/Product';
import { sortProducts } from '@/utils/SortAvailableProducts';
import next from 'next';
import { useEffect, useState } from 'react'

const ProductListing = () => {

  const [selectedOption, setSelectedOption] = useState('NEWEST')
  const [isOpen, setIsOpen] = useState(false);
  const [discounts, setDiscounts] = useState<{ [key: number]: DiscountModel | null }>({})
  const [limit, setLimit] = useState(20)
  const [offset, setOffset] = useState(0)
  const [sortBy, setSortBy] = useState('newest')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedWarranty, setSelectedWarranty] = useState<boolean | undefined>(undefined)
  const [loading, setLoading] = useState(true)

    const {data: fetchedData } = useFetch<DataWithCount<ProductModel>>({
      endpoint: `https://api.babycycle.my.id/api/v1/products/sorting?limit=${limit}&offset=${offset}&sort_by=${sortBy}`
    })

    console.log(fetchedData)

    const {data: filteredData } = useFetch<DataWithCount<ProductModel>>({
      endpoint: `https://api.babycycle.my.id/api/v1/products/category?limit=${limit}&offset=${offset}&category=${selectedCategories}`
    })

    console.log(filteredData)

    const {data: warrantyData } = useFetch<DataWithCount<ProductModel>>({
      endpoint: `https://api.babycycle.my.id/api/v1/products/warranty?limit=${limit}&offset=${offset}&is_warranty=${selectedWarranty}`
    })
    
    console.log(warrantyData)

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
        fetchDiscounts(fetchedData.data)
        setLoading(false)
      }
    }, [fetchedData]); 

    const filteredByCategory = filteredData?.data || [];
    const filteredByWarranty = warrantyData?.data || [];

    let combinedData: ProductModel[] = []

      // filter by categories
      if (selectedCategories.length > 0) {
        combinedData = filteredByCategory.filter(product => selectedCategories.includes(product.category)
        )
      }

      // filter by warranty
      if (selectedWarranty !== undefined && selectedCategories.length === 0) {
        combinedData = filteredByWarranty.filter(product => product.is_warranty === selectedWarranty)
      }
      
      // filter by warranty if product in category is empty
      if (!combinedData && selectedWarranty !== undefined) {
        combinedData = filteredByWarranty.filter(product => product.is_warranty === selectedWarranty)
      }
      
      // filter by warranty if theres product after filtering by category
      if (combinedData.length > 0 && selectedWarranty !== undefined) {
        combinedData = combinedData.filter(product => product.is_warranty === selectedWarranty);
      }
      
      // if no filter applied
      if (selectedCategories.length === 0 && selectedWarranty === undefined) {
        combinedData = fetchedData?.data || [];
      }
    

    const sortedData = sortProducts(combinedData, sortBy)

    const toggleDropdown = () => {
      setIsOpen(true)
    };
  
    const handleSelect = (option: any) => {
      setSelectedOption(option)
      setIsOpen(false)
      let sortValue = '';
      switch (option) {
        case 'HIGHEST PRICE':
          sortValue = 'highest_price'
          break
        case 'LOWEST PRICE':
          sortValue = 'lowest_price'
          break
        case 'NEWEST':
          sortValue = 'newest'
          break
        // case 'DISCOUNT':
        //   sortValue = 'discount'
        //   break
      }
      setSortBy(sortValue)
    }

    const handlePage = (direction: string) => {
      if (direction === 'next') {
        setOffset((prev) => prev + limit)
      } else if (direction === 'prev' && offset > 0) {
        setOffset((prev) => prev - limit);
      }
    }

    const handleCategoryChange = (category: string) => {
      setSelectedCategories([category])
    }

    const handleWarrantyChange = (warranty: boolean) => {
      setSelectedWarranty(warranty)
    }

    const totalPages = fetchedData? Math.ceil(fetchedData.total_count / limit) : 0
    const currentPage = Math.floor(offset / limit) + 1;
    

  return (
    <div className='body-width flex'>
      <div className='w-72 uppercase py-3 flex flex-col gap-6'>
        <div className='text-xl text-buttonBlue'>All Filters</div>

        <div className='flex flex-col gap-2 px-3'>
          <div>Product Type</div>
          <div className='flex flex-col gap-1 text-sm'>

            <label className='flex gap-2 items-center'>
              <input type="radio"
                name="category"
                value="clothing"
                onChange={() => handleCategoryChange('clothing')}/>
              <span>Clothing</span>
            </label>
            <label className='flex gap-2 items-center'>
              <input type="radio"
                name="category"
                value="furniture"
                onChange={() => handleCategoryChange('furniture')}/>
              <span>furniture</span>
            </label>
            <label className='flex gap-2 items-center'>
              <input type="radio"
                name="category"
                value="toys"
                onChange={() => handleCategoryChange('toys')}/>
              <span>toys</span>
            </label>
            <label className='flex gap-2 items-center'>
              <input type="radio"
                name="category"
                value="others"
                onChange={() => handleCategoryChange('others')}/>
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
                value='true'
                checked={selectedWarranty === true}
                onChange={() => handleWarrantyChange(true)}/>
              <span>yes</span>
            </label>
            <label className='flex gap-2 items-center'>
              <input type="radio"
                name="warranty"
                value="false"
                checked={selectedWarranty === false}
                onChange={() => handleWarrantyChange(false)}/>
              <span>no</span>
            </label>
          </div>
        </div>

        {/* <div className='pt-8'>
          <PrimaryButton type='button'>Apply</PrimaryButton>
        </div> */}

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
                {/* <li className="px-4 py-2 hover:bg-buttonBlue hover:text-white cursor-pointer"
                    onClick={() => handleSelect('DISCOUNT')}>
                  Discount
                </li>          */}
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

        </div>
        <div className='flex flex-wrap justify-between gap-6'>
          {loading ? (
            <div className='w-full h-56 flex justify-center items-center'>
                <Spinner />
            </div>
          ) : ( 
            sortedData && sortedData.length > 0 ? (
              sortedData.map((product, index) => {
                  const discountData = discounts[product.id]

                  return (
                    <ProductCard
                      id={product.id}
                      key={index}
                      image_url={product.image_url}
                      name={product.name}
                      price={product.price}
                      stock={product.stock}
                      discount={discountData}
                    />
                  )
                })
              ) : (
                <div className='w-full h-[500px] flex justify-center items-center'>
                  <span>No products available</span>
                </div>
              )
            )}
          
        </div>
        <div>
          <div className='flex justify-end space-x-6 py-8'>
            <div>
              <img src='/Polygon_2.png'
                onClick={() => handlePage('prev')}
                className={currentPage === 1 ? 'cursor-not-allowed opacity-20' : ''}/>
            </div>
            <div>Showing page {currentPage} from total of {totalPages} pages</div>
            <div>
              <img src='/Polygon_3.png'
                onClick={() => handlePage('next')}
                className={currentPage === totalPages ? 'cursor-not-allowed opacity-20' : ''}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListing