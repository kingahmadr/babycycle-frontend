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

  const getDiscount = async (id: number) => {
    const response = await fetch(
      `https://api.babycycle.my.id/api/v1/discount/${id}`
    );
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
      setLoading(false);
    });
    if (discountMap !== null) {
      setDiscounts(discountMap);
    }
  };

  useEffect(() => {
    if (saleProducts?.data.length > 0) {
      fetchDiscounts(saleProducts.data);
    }
  }, [saleProducts]);

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
          <div className="w-[240px] max-md:w-full h-[291px] max-md:h-auto flex md:flex-col gap-around max-md:justify-between max-md:items-center">
            <span className="h-1/2 uppercase text-6xl max-md:text-5xl">
              Sale & Promo
            </span>
            <div className="h-1/2 flex justify-center items-center">
              <PrimaryButton
                type="button"
                onClick={() => handleClick(PAGE_LISTING)}
              >
                See All
              </PrimaryButton>
            </div>
          </div>
          <div className="grid grid-rows-1 max-md:grid-rows-2 grid-cols-4 max-md:grid-cols-2 gap-6 py-16 max-md:py-4">
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
                  <ProductCard
                    id={product.id}
                    key={index}
                    image_url={product.image_url}
                    name={product.name}
                    price={product.price}
                    stock={product.stock}
                    discount={discounts[product.id]}
                  />
                ) : null
              )
            )}
          </div>
        </div>

        <div className="flex max-md:flex-col-reverse justify-between items-center gap-6">
          <div className="grid grid-rows-1 grid-cols-4 max-md:grid-rows-2 max-md:grid-cols-2 gap-6 py-16 max-md:py-4">
            {newProducts &&
              newProducts.data.map((product, index) => (
                <ProductCard
                  id={product.id}
                  key={index}
                  image_url={product.image_url}
                  name={product.name}
                  price={product.price}
                  stock={product.stock}
                />
              ))}
          </div>

          <div className="w-[240px] max-md:w-full h-[291px] max-md:h-auto flex md:flex-col gap-around max-md:justify-between max-md:items-center">
            <span className="h-1/2 uppercase text-6xl max-md:text-5xl">
              New Arrival
            </span>
            <div className="h-1/2 flex justify-center items-center">
              <PrimaryButton
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
      `https://api.babycycle.my.id/api/v1/products/sorting?limit=4&offset=0&sort_by=newest`
    );
    if (!response.ok) throw new Error("Failed to fetch");
    newProducts = await response.json();

    const saleResponse = await fetch(
      `https://api.babycycle.my.id/api/v1/products`
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
