import { GetServerSideProps } from "next";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ProductModel } from "@/models/Product";
import { DiscountModel } from "@/models/Discount";
import { CartContext } from "@/context/CartContext";
import Image from "next/image";
import { finalPrice } from "@/utils/DiscountedPrice";
import { useSnackbar } from "notistack";
import { API_CARTS, API_REVIEW } from "@/constants/apis";
import { useAuth } from "@/context/AuthContext";
import { ReviewData, ReviewModel } from "@/models/Reviews";
import { useParams } from "next/navigation";
import { data } from "autoprefixer";

interface ProductDetailsPageProps {
  product: ProductModel;
  discount: DiscountModel | null;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  discount,
}) => {
  const { id } = useParams<{ id: string }>();
  const cartContext = useContext(CartContext);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated } = useAuth();
  const [review, setReview] = useState<ReviewData>();

  const fetchReview = async () => {
    try {
      const response_review = await fetch(`${API_REVIEW}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const review = response_review.ok ? await response_review.json() : [];
      setReview(review);

      // if (Array.isArray(review)) {
      //   setReview(review);
      // } else {
      //   setReview([]);
      // }
    } catch (error) {
      enqueueSnackbar("Failed to fetch review.", {
        variant: "error",
      });
    }
  };

  const discountedPrice = finalPrice(
    product.price,
    Number(discount?.discount_percentage) || 0
  );

  if (!cartContext) {
    throw new Error(
      "CartContext is not available. Ensure CartProvider wraps the component."
    );
  }

  const { addToCart, fetchCart } = cartContext;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      enqueueSnackbar("You must be logged in to add items to the cart.", {
        variant: "error",
      });
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(API_CARTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify([
          {
            product_id: product.id.toString(),
            name: product.name,
            total_price: discountedPrice,
            quantity: 1,
          },
        ]), // Send as an array
      });
      const productData = await response.json();

      if (!response.ok) {
        enqueueSnackbar(
          "Failed to process add item to cart. Please try again.",
          {
            variant: "error",
          }
        );
        return;
      }

      // addToCart(productData);
      fetchCart();
      router.push("/cart");

      // addToCart({
      //   id: product.id.toString(),
      //   name: product.name,
      //   price: discountedPrice,
      //   quantity: 1,
      // });

      enqueueSnackbar("Product has been added to the cart!", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("Failed to add product to the cart. Please try again.", {
        variant: "error",
      });
    }
  };

  const handleBuyNow = () => {
    try {
      // addToCart({
      //   id: product.id.toString(),
      //   name: product.name,
      //   total_price: discountedPrice,
      //   quantity: 1,
      // });

      // router.push("/cart");
      window.location.href = "/cart";

      enqueueSnackbar("Product added to cart. Proceeding to checkout.", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("Failed to add product to the cart. Please try again.", {
        variant: "error",
      });
    }
  };

  const averageReview = (): number | null => {
    if (!review || review.data?.length === 0) return 0; // Return null if no review? are provided

    const totalRating = review.data?.reduce((sum, x) => sum + x.rating, 0);
    return totalRating / review.data?.length; // Calculate the average rating
  };

  useEffect(() => {
    fetchReview();
  }, [id]);

  console.log(review);

  return (
    <div className="py-12 px-4 bg-white max-w-[1440]">
      {/* Product Section */}
      <div className="flex flex-col lg:flex-row lg:space-x-12 mb-8 items-center">
        <div className="lg:w-1/2 p-6">
          {/* Product Image */}
          <Image
            src={product.image_url || "/assets/placeholder_image.jpg"} // Placeholder Image
            alt={product.name || "Item Image"}
            width={500}
            height={500}
            className="rounded-lg object-cover w-full max-w-[500px]"
          />
        </div>
        <div className="lg:w-1/2">
          <h1 className="text-heading-xl mb-4 text-center lg:text-left">
            {product.name || "PRODUCT NAME"}
          </h1>
          <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
            {/* Price before discount */}
            {discount && (
              <p className="line-through text-body-md text-formGray">
                IDR{" "}
                {product?.price ? product.price.toLocaleString("id-ID") : ""}
              </p>
            )}

            {/* Price after discount */}
            <p className="text-dangerRed text-body-md font-bold">
              IDR {discountedPrice.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
            <p className="text-body-lg">
              {isAuthenticated
                ? averageReview()
                  ? `${averageReview()} / 5 ⭐`
                  : "No rating yet."
                : "Please log in to see rating."}
            </p>
            <p className="text-body-md text-formGray">
              {isAuthenticated
                ? review && review.data?.length > 0
                  ? review.data[review.data?.length - 1].review
                  : "No review yet."
                : "Please log in to see review."}
            </p>
          </div>

          {/* Warranty and Category */}
          <div className="flex justify-center lg:justify-start space-x-4 mb-4">
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
            <button
              className="btn-add-to-cart w-full "
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button className="btn-buy-now w-full" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          <p className="text-body-md text-center lg:text-left">
            {product.descriptions || "No description available."}
          </p>
        </div>
      </div>

      {/* review? Section */}
      <div className="mt-12">
        <h2 className="text-heading-md text-center mb-8 uppercase">
          review & rating
        </h2>
        <div className="flex flex-col lg:flex-row lg:space-x-8 mb-8">
          <div className="w-full lg:w-1/3 bg-gray-100 p-6 flex flex-col items-center">
            <p className="text-heading-xl p-6">
              {isAuthenticated
                ? averageReview()
                  ? `${averageReview()} / 5 ⭐`
                  : "No rating yet."
                : "Please log in to see rating."}
            </p>
            <p className="text-body-md p-6">
              {isAuthenticated
                ? review && review.data?.length > 0
                  ? review.data[review.data?.length - 1].review
                  : "No review yet."
                : "Please log in to see review."}
            </p>
          </div>
          <div className="w-full lg:w-2/3 space-y-6 p-6">
            {review?.data?.map((i) => (
              <div key={i.id} className="border-b border-gray-300 pb-4">
                <div className="flex items-center space-x-4">
                  <p className="text-body-md text-formGray">{i.rating}/5 ⭐</p>
                  <p className="text-body-md">{i.review}</p>
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

    const product = await response_product.json();
    const discount = response_discount.ok
      ? await response_discount.json()
      : null;

    return {
      props: {
        product,
        discount,
      },
    };
  } catch (error) {
    console.error("Failed to fetch product details:", error);

    return {
      notFound: true,
    };
  }
};
