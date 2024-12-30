import ProductCard from "@/components/ProductCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useEffect, useState } from "react";
import { ProductModel } from "@/models/Product";
import { DataWithCount } from "@/models/DataWithCount";
import { GetStaticProps } from "next";
import { DiscountModel } from "@/models/Discount";

import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { PAGE_LISTING } from "@/constants/pages";
import { API_PRODUCT_WITH_COUNT } from "@/constants/apis";

interface ProductsProps {
  newProducts: DataWithCount<ProductModel>;
  saleProducts: DataWithCount<ProductModel>;
}

const Home = ({ newProducts, saleProducts }: ProductsProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [discounts, setDiscounts] = useState<{
    [key: number]: DiscountModel | null;
  }>({});
    const fetchDiscount = async () => {
      setLoading(true);
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
      } finally{
        setLoading(false);
      }
    };
  

  useEffect(() => {
    if (saleProducts?.data.length > 0) {
      fetchDiscount();
    }
  }, [saleProducts]);

  console.log(saleProducts.data);

  const handleClick = (href: string) => {
    router.push(href);
  };

  return (
    <>
      <div className="w-full bg-babyBlue max-md:bg-transparent">
        <div className="h-[660px] bg-[url(/Hero.png)] max-md:bg-[url(/Hero2.png)] bg-no-repeat bg-center max-md:bg-left flex object-contain w-full">
          <div className="w-full flex justify-end">
            <div className="w-1/2 max-md:w-full flex flex-col justify-center items-center gap-6">
              <span className="font-decor text-4xl">
                Smart mom, shop recycle
              </span>
              <PrimaryButton
                type="button"
                onClick={() => handleClick(PAGE_LISTING)}
              >
                Explore
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px]">
        <div className="w-full flex max-md:flex-col gap-6 justify-start items-center">
          <div className="w-[240px] max-md:w-full mobile:h-[200px] h-[291px] max-md:h-auto flex md:flex-col gap-around max-md:justify-between max-md:items-center">
            <span className="h-1/2 uppercase md:text-6xl md:font-bold max-md:text-5xl mobile:text-4xl mobile:font-bold">
              Sale & Promo
            </span>
            <div className="h-1/2 flex justify-center items-center mobile:items-start w-auto">
              <PrimaryButton
                className="mobile:rounded-lg"
                type="button"
                onClick={() => handleClick(PAGE_LISTING)}
              >
                See All
              </PrimaryButton>
            </div>
          </div>
          <div className="grid grid-rows-1 md:grid-rows-2 grid-cols-4 md:grid-cols-2 gap-6 py-16 md:py-4">
            {loading ? (
              <div className="w-[500%] max-md:w-[200%] h-56 flex flex-wrap justify-center items-center">
                <Spinner />
              </div>
            ) : (
              saleProducts &&
              saleProducts.data.map((product, index) =>
                discounts[product.id] &&
                discounts[product.id]?.is_active &&
                product.stock !== 0 ? (
                    <div key={index} className="mobile:hidden">

                        <ProductCard
                          id={product.id}
                          key={index}
                          image_url={product.image_url}
                          name={product.name}
                          price={product.price}
                          stock={product.stock}
                          discount={discounts[product.id]}
                        />
                    </div>
                ) : null
              )
            )}
          </div>
        </div>

        <div className="flex max-md:flex-col-reverse justify-between items-center gap-6">
          <div className="grid grid-rows-1 md:grid-rows-2 grid-cols-4 md:grid-cols-2 gap-6 py-16 md:py-4 ">
            { loading ? (
              <div className="w-[500%] max-md:w-[200%] h-56 flex flex-wrap justify-center items-center">
                <Spinner />
              </div>
            ) : (
            newProducts &&
              newProducts.data.map((product, index) => (
                <div key={index} className="mobile:hidden">

                  <ProductCard
                    id={product.id}
                    key={index}
                    image_url={product.image_url}
                    name={product.name}
                    price={product.price}
                    stock={product.stock}
                    />
                </div>
              )))}
          </div>

          <div className="w-[240px] max-md:w-full mobile:h-[200px] h-[291px] max-md:h-auto flex md:flex-col gap-around max-md:justify-between max-md:items-center">
            <span className="h-1/2 uppercase text-6xl max-md:text-5xl mobile:text-4xl mobile:font-bold">
              New Arrival
            </span>
            <div className="h-1/2 flex justify-center items-center mobile:items-start rounded-md">
              <PrimaryButton
                className="mobile:rounded-lg"
                type="button"
                onClick={() => handleClick(PAGE_LISTING)}
              >
                See All
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  let newProducts: DataWithCount<ProductModel> = { data: [], total_count: 0 };
  let saleProducts: DataWithCount<ProductModel> = { data: [], total_count: 0 };

  try {
    const response = await fetch(
      `${API_PRODUCT_WITH_COUNT}?limit=4&offset=0&sort_by=newest`
    );
    if (!response.ok) throw new Error("Failed to fetch");
    newProducts = await response.json();

    const saleResponse = await fetch(
      `${API_PRODUCT_WITH_COUNT}?limit=4&offset=0&category=discount`
    );
    if (!saleResponse.ok) throw new Error("Failed to fetch sale products");
    saleProducts = await saleResponse.json();

    console.log(saleProducts);
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      newProducts,
      saleProducts,
    },
  };
};

export default Home;
