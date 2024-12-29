import ProductCard from "@/components/ProductCard";
import Spinner from "@/components/Spinner";
import { API_PRODUCT_WITH_COUNT } from "@/constants/apis";
import { DataWithCount } from "@/models/DataWithCount";
import { DiscountModel } from "@/models/Discount";
import { ProductModel } from "@/models/Product";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

const ProductListing = () => {
  const [selectedOption, setSelectedOption] = useState("NEWEST");
  const [isOpen, setIsOpen] = useState(false);
  const [discounts, setDiscounts] = useState<{
    [key: number]: DiscountModel | null;
  }>({});
  const [offset, setOffset] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[] | undefined>([]);
  const [selectedWarranty, setSelectedWarranty] = useState<boolean | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<DataWithCount<ProductModel> | undefined>();
  const [fetchedData, setFetchedData] = useState<ProductModel[]>([]);
  const limitPagination = 20
  const limit = 0


  const fetchProduct = async () => {
    setLoading(true);
    try {
      // const response = await fetch(`${API_PRODUCT_WITH_COUNT}?limit=${limit}&offset=${offset}`, {});
      const response = await fetch(`${API_PRODUCT_WITH_COUNT}`);

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

  const fetchDiscount = async () => {
    try {
      const response = await fetch(`${API_PRODUCT_WITH_COUNT}?category=discount`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch discounts: ${response.statusText}`);
      }
  
      // Extract the array properly
      const responseData = await response.json();
      const discountArray = responseData.data; // Adjust this based on actual response structure
  
      if (!Array.isArray(discountArray)) {
        throw new Error("Expected discountArray to be an array");
      }
  
      // Transform the array into the expected format
      const discountMap: { [key: number]: DiscountModel | null } = {};
      discountArray.forEach((discount) => {
        discountMap[discount.id] = discount;
      });
  
      setDiscounts(discountMap); // Set the transformed data into state
      return discountMap;
    } catch (error) {
      console.error("Error fetching discounts:", error);
      return {};
    }
  };

  useEffect(() => {
    if (fetchedData) {
      fetchDiscount()
      setLoading(false);
    }
  }, [fetchedData]);


  const toggleDropdown = () => {
    setIsOpen(true);
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    switch (option) {
      case "HIGHEST PRICE":
        fetchFilteredData({ sort_by : "highest_price" });
        break;
      case "LOWEST PRICE":  
        fetchFilteredData({ sort_by : "lowest_price" });
        break;
      case "NEWEST":
        fetchFilteredData({ sort_by : "newest" });
        break;
    }
    // setSortBy(sortValue);
  };

  const fetchFilteredData = async ({
    category = "",
    is_warranty,
    sort_by,
  }: {
    category?: string;
    is_warranty?: boolean;
    sort_by?: string;
  }) => {
    try {
      setLoading(true); // Set loading before starting the fetch
  
      // Construct the query parameters dynamically
      const queryParams = new URLSearchParams();
      queryParams.append("category", category); // Always include the category, even if empty
      if (is_warranty !== undefined) {
        queryParams.append("is_warranty", is_warranty.toString());
      }

      if (sort_by !== undefined) {
        queryParams.append("sort_by", sort_by);
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

  const handlePage = (direction: string) => {
    const currentDataLength = filteredData?.data.length || fetchedData.length;

    if (direction === "next" && offset + limitPagination < currentDataLength) {
      setOffset((prev) => prev + limitPagination);
    } else if (direction === "prev" && offset > 0) {
      setOffset((prev) => prev - limitPagination);
    }
  };

  const totalPages = Math.ceil((filteredData?.data.length || fetchedData.length) / limitPagination);
  const currentPage = Math.floor(offset / limitPagination) + 1;

  const currentPageData =
    Array.isArray(filteredData?.data) && filteredData.data.length > 0
      ? filteredData.data.slice(offset, offset + limitPagination)
      : fetchedData.slice(offset, offset + limitPagination);

  return (
    <div className="max-w-[1440px] px-[72px] max-md:px-6 flex max-md:flex-col w-full">
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
          <div className="grid lg:grid-cols-4 max-md:grid-cols-2 md:grid-cols-2 md:gap-10 md:gap-y-10">
            {loading ? (
              <div className="w-[500%] h-[400%] flex justify-center items-center">
                <Spinner />
              </div>
            ) : currentPageData.length > 0 ? (
              currentPageData.map((product, index) => (
                <ProductCard
                  id={product.id}
                  key={index}
                  image_url={product.image_url}
                  name={product.name}
                  price={product.price}
                  stock={product.stock}
                  discount={discounts[product.id]}
                />
              ))
            ) : (
              <div className="w-full h-[500px] flex justify-center items-center">
                <span>No products available</span>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-6 py-8 my-24">
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
