import { GetServerSideProps } from "next";
import { useContext } from "react";
import { useRouter } from "next/router";
import { ProductModel } from "@/models/Product";
import { CartContext } from "@/context/CartContext";
import Image from "next/image";

interface ProductDetailsPageProps {
  product: ProductModel;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ product }) => {
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
      price: product.price,
      quantity: 1,
    });
    alert("Product has been added to the cart!");
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
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
            <p className="text-dangerRed text-body-md font-bold">
              IDR {product.price.toLocaleString()}
            </p>
            <p className="line-through text-body-md text-formGray">
              {product.oldPrice || "IDR 199,999.99"}
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
  const API_URL = `https://api.babycycle.my.id/api/v1/products/${id}`;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      return {
        notFound: true,
      };
    }

    const product = await response.json();

    return {
      props: {
        product,
      },
    };
  } catch (error) {
    console.error("Failed to fetch product details:", error);

    return {
      notFound: true,
    };
  }
};
