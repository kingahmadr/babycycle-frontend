import { GetServerSideProps } from "next";
import { useContext } from "react";
import { useRouter } from "next/router";
import { ProductModel } from "@/models/Product";
import { DiscountModel } from "@/models/Discount";
import { CartContext } from "@/context/CartContext";
import Image from "next/image";
import { finalPrice } from "@/utils/DiscountedPrice";

interface ProductDetailsPageProps {
  product: ProductModel;
  discount: DiscountModel | null;
  discountedPrice: number;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ product,discount, discountedPrice }) => {
  const cartContext = useContext(CartContext);
  const router = useRouter();
  
  if (!cartContext) {
    throw new Error("CartContext is not available. Ensure CartProvider wraps the component.");
  }

  const { addToCart } = cartContext;

  const handleAddToCart = () => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: discountedPrice,
      quantity: 1,
    });
    alert("Product has been added to the cart!");
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: discountedPrice,
      quantity: 1,
    });
    router.push("/cart");
  };

  return (
    <div className="py-12 px-20 bg-white min-w-[1440]">
      {/* Product Section */}
      <div className="flex space-x-12 mb-8">
        <div className="w-1/2">
          {/* Product Image */}
          <Image
            src={product.image_url || "/assets/placeholder-large.png"} // Placeholder Image
            alt={product.name || "Item Image"}
            width={500}
            height={500}
            className="rounded-lg object-cover"
          />
          <div className="flex space-x-2 mt-4">
            {[1, 2, 3].map((i) => (
              <Image
                key={i}
                src={"/assets/placeholder-small.png"} // Placeholder Small Images
                alt="Item Thumbnail"
                width={150}
                height={150}
                className="rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
        <div className="w-1/2">
          <h1 className="text-heading-xl mb-4">{product.name || "PRODUCT NAME"}</h1>
          <div className="flex items-center space-x-4 mb-4">
            {/* Price before discount */}
            {discount && (
              <p className="line-through text-body-md text-formGray">
                IDR {product?.price ? product.price.toLocaleString() : ""}
              </p>
            )}
  
            {/* Price after discount */}
            <p className="text-dangerRed text-body-md font-bold">
              IDR {discountedPrice.toLocaleString()}
            </p>
          </div>
  
          <div className="flex items-center space-x-4 mb-4">
            <p className="text-body-lg">{product.rating || 4.5} ⭐</p>
            <p className="text-body-md text-formGray">
              ({product.reviews || 10} reviews)
            </p>
          </div>
  
          {/* Warranty and Category */}
          <div className="flex space-x-4 mb-4">
            {product.is_warranty && (
              <span className="text-label-md bg-green-500 px-4 py-2 uppercase text-white">
                Warranty
              </span>
            )}
            <span className="text-label-md bg-gray-200 px-4 py-2 uppercase">
              {product.category || "Toys"}
            </span>
          </div>
  
          {/* Buttons */}
          <div className="flex flex-col space-y-4 py-10">
            <button className="btn-add-to-cart w-1/2" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="btn-buy-now w-1/2" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
  
          <p className="text-body-md">{product.descriptions || "No description available."}</p>
        </div>
      </div>
  
      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-heading-md text-center mb-8">Reviews</h2>
        <div className="flex space-x-8 mb-8">
          <div className="w-1/3 bg-gray-100 p-6 flex flex-col items-center">
            <p className="text-heading-xl">{product.rating || 4.5} ⭐</p>
            <p className="text-body-md">({product.reviews || 10} reviews)</p>
          </div>
          <div className="w-2/3 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-gray-300 pb-4">
                <div className="flex items-center space-x-4">
                  <p className="text-body-md text-formGray">{i + 2}/5 ⭐</p>
                  <p className="text-body-md">
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default ProductDetailsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const API_URL_PRODUCT = `https://api.babycycle.my.id/api/v1/products/${id}`;
  const API_URL_DISCOUNT = `https://api.babycycle.my.id/api/v1/discount/${id}`;

  try {
    const response_product = await fetch(API_URL_PRODUCT);
    const response_discount = await fetch(API_URL_DISCOUNT);

    if (!response_product.ok) {
      return {
        notFound: true,
      };
    }

    // if (!response_discount.ok) {
    //   return {
    //     undefined,
    //   };
    // }


    const product = await response_product.json();
    // const discount = await response_discount.json();
    const discount = response_discount.ok ? await response_discount.json() : null;
    console.log(product,discount);
    const discountedPrice = finalPrice(product.price,Number(discount?.discount_percentage)||0);


    return {
      props: {
        product, discount, discountedPrice
      },
    };
  } catch (error) {
    console.error("Failed to fetch product details:", error);

    return {
      notFound: true,
    };
  }
};

