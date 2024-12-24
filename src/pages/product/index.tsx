// import { PrimaryButton } from "@/components/PrimaryButton";
import ProductCard from "@/components/ProductCard";
import Spinner from "@/components/Spinner";
import { API_PRODUCT_WITH_COUNT } from "@/constants/apis";
// import useFetch from "@/hooks/useFetch";
import { DataWithCount } from "@/models/DataWithCount";
import { DiscountModel } from "@/models/Discount";
import { ProductModel } from "@/models/Product";
// import { sortProducts } from "@/utils/SortAvailableProducts";
// import next from "next";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

const ProductListing = () => {
  const [selectedOption, setSelectedOption] = useState("NEWEST");
  const [isOpen, setIsOpen] = useState(false);
  const [discounts, setDiscounts] = useState<{
    [key: number]: DiscountModel | null;
  }>({});
  // const [limit, setLimit] = useState(20);
  let limit = 0
  const [offset, setOffset] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategories, setSelectedCategories] = useState<string[] | undefined>([]);
  const [selectedWarranty, setSelectedWarranty] = useState<boolean | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<DataWithCount<ProductModel> | undefined>();
  const [fetchedData, setFetchedData] = useState<ProductModel[]>([]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_PRODUCT_WITH_COUNT}`, {});

      const data: DataWithCount<ProductModel> = await response.json();

      if (!response.ok) {
        console.error("Error response:", data);
        enqueueSnackbar("Failed to fetch data.", {
          variant: "error",
        });
        return;
      }
      setFetchedData(data.data);
    } catch (error) {
      console.error("Error fetching data :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const getDiscount = async (id: number) => {
    const response = await fetch(
      `https://api.babycycle.my.id/api/v1/discount/${id}`
    );
    // const response = await fetch(
    //   `$`
    // );
    const discountData: DiscountModel = await response.json();
    return discountData;
  };

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
    if (fetchedData) {
      fetchDiscounts(fetchedData);
      setLoading(false);
    }
  }, [fetchedData]);


  const toggleDropdown = () => {
    setIsOpen(true);
  };

  const handleSelect = (option: any) => {
    setSelectedOption(option);
    setIsOpen(false);
    let sortValue = "";
    switch (option) {
      case "HIGHEST PRICE":
        sortValue = "highest_price";
        break;
      case "LOWEST PRICE":
        sortValue = "lowest_price";
        break;
      case "NEWEST":
        sortValue = "newest";
        break;
      // case 'DISCOUNT':
      //   sortValue = 'discount'
      //   break
    }
    setSortBy(sortValue);
  };

  const handlePage = (direction: string) => {
    const currentDataLength = filteredData?.data?.length || 0;
  
    if (direction === "next" && offset + limit < currentDataLength) {
      setOffset((prev) => prev + limit);
    } else if (direction === "prev" && offset > 0) {
      setOffset((prev) => prev - limit);
    }
  };
  const fetchFilteredData = async ({
    category = "",
    is_warranty,
  }: {
    category?: string;
    is_warranty?: boolean;
  }) => {
    try {
      setLoading(true); // Set loading before starting the fetch
  
      // Construct the query parameters dynamically
      const queryParams = new URLSearchParams();
      queryParams.append("category", category); // Always include the category, even if empty
      if (is_warranty !== undefined) {
        queryParams.append("is_warranty", is_warranty.toString());
      }
      queryParams.append("limit", limit.toString());
      queryParams.append("offset", offset.toString());
  
      const response = await fetch(`${API_PRODUCT_WITH_COUNT}?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const filteredData = await response.json();
      setFilteredData(filteredData); // Assuming you set the state for filtered data
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      setFilteredData({ data: [], total_count: 0 }); // Fallback for error cases
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategories([category]); // Assuming selectedCategories is an array
    fetchFilteredData({ category }); // Pass an object with the category property
    setFetchedData([]);
  };
  
  
  const handleWarrantyChange = (warranty: boolean) => {
    setSelectedWarranty(warranty);
  
    // Convert selectedCategories to a comma-separated string or use an empty string
    const categoryParam = selectedCategories?.join(",") || "";
  
    fetchFilteredData({ category: categoryParam, is_warranty: warranty });
  };

  const totalPages = Math.ceil((filteredData?.data?.length || 0) / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  console.log(fetchedData);

  return (
    <div className="max-w-[1440px] px-[72px] max-md:px-6 flex max-md:flex-col">
      <div className="w-72 max-md:w-full uppercase py-3 flex flex-col max-md:flex-row gap-6 max-md:justify-between">
        <div className="text-xl text-buttonBlue">All Filters</div>

        <div className="flex flex-col gap-2 px-3">
          <div>Product Type</div>
          <div className="flex flex-col gap-1 text-sm">
            <label className="flex gap-2 items-center">
              <input
                type="radio"
                name="category"
                value="clothings"
                onChange={() => handleCategoryChange("clothings")}
              />
              <span>Clothings</span>
            </label>
            <label className="flex gap-2 items-center">
              <input
                type="radio"
                name="category"
                value="furnitures"
                onChange={() => handleCategoryChange("furnitures")}
              />
              <span>furnitures</span>
            </label>
            <label className="flex gap-2 items-center">
              <input
                type="radio"
                name="category"
                value="toys"
                onChange={() => handleCategoryChange("toys")}
              />
              <span>toys</span>
            </label>
            <label className="flex gap-2 items-center">
              <input
                type="radio"
                name="category"
                value="others"
                onChange={() => handleCategoryChange("others")}
              />
              <span>others</span>
            </label>
            <label className="flex gap-2 items-center">
              <input
                type="radio"
                name="category"
                value="stroller"
                onChange={() => handleCategoryChange("strollers")}
              />
              <span>strollers</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-3">
          <div>warranty</div>
          <div className="flex flex-col gap-1 text-sm">
            <label className="flex gap-2 items-center">
              <input
                type="radio"
                name="warranty"
                value="true"
                checked={selectedWarranty === true}
                onChange={() => handleWarrantyChange(true)}
              />
              <span>yes</span>
            </label>
            <label className="flex gap-2 items-center">
              <input
                type="radio"
                name="warranty"
                value="false"
                checked={selectedWarranty === false}
                onChange={() => handleWarrantyChange(false)}
              />
              <span>no</span>
            </label>
          </div>
        </div>

        {/* <div className='pt-8'>
          <PrimaryButton type='button'>Apply</PrimaryButton>
        </div> */}
      </div>

      <div className="w-full">
        <div className="uppercase text-[14px] h-auto py-3 max-md:py-6 flex justify-end max-md:justify-start items-center">
          <div className="flex items-center gap-3">
            <span className="text-buttonBlue">Sort By</span>
            <button
              className="w-60 h-8 flex justify-between items-center bg-white text-black border-black border-2 rounded-none px-4 text-left"
              onClick={toggleDropdown}
            >
              {selectedOption}
              <img src="/Polygon_1.png" />
            </button>
          </div>

          {isOpen && (
            <div className="relative z-20">
              <div className="absolute w-60 h-auto top-4 right-0 bg-white border-none rounded-none z-10">
                <ul>
                  <li
                    className="px-4 py-2 hover:bg-buttonBlue hover:text-white cursor-pointer"
                    onClick={() => handleSelect("HIGHEST PRICE")}
                  >
                    Highest Price
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-buttonBlue hover:text-white cursor-pointer"
                    onClick={() => handleSelect("LOWEST PRICE")}
                  >
                    Lowest Price
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-buttonBlue hover:text-white cursor-pointer"
                    onClick={() => handleSelect("NEWEST")}
                  >
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
              className="fixed inset-0 bg-transparent bg-opacity-40 z-10"
              onClick={() => setIsOpen(false)}
            ></div>
          )}
        </div>
        <div className="grid grid-rows-5 grid-cols-4 gap-6 max-md:grid-cols-2 max-md:gap-3">
              {loading ? (
                <div className="w-[500%] h-[400%] flex justify-center items-center">
                  <Spinner />
                </div>
              ) : (() => {
                  // Determine current page data
                  const currentPageData =
                    Array.isArray(filteredData?.data) && filteredData.data.length > 0
                      ? filteredData.data
                      : fetchedData ;

                  return currentPageData.length > 0 ? (
                    currentPageData.map((product, index) => {
                      const discountData = discounts[product.id];
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
                      );
                    })
                  ) : (
                    <div className="w-full h-[500px] flex justify-center items-center">
                      <span>No products available</span>
                    </div>
                  );
                })()}
            </div>
          <div className="flex justify-end space-x-6 py-8">
            <div>
              <img
                src="/Polygon_2.png"
                onClick={() => handlePage("prev")}
                className={
                  currentPage === 1 ? "cursor-not-allowed opacity-20" : ""
                }
              />
            </div>
            <div>
              Showing page {currentPage} from total of {totalPages} pages
            </div>
            <div>
              <img
                src="/Polygon_3.png"
                onClick={() => handlePage("next")}
                className={
                  currentPage === totalPages
                    ? "cursor-not-allowed opacity-20"
                    : ""
                }
              />
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProductListing;
