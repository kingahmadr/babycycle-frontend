// import { GetServerSideProps } from "next";
import Image from "next/image";

const ProductDetailsPage: React.FC = () => {
  const product = {
    name: "PRODUCT NAME", // Placeholder; can be replaced by API data.
    price: "IDR 99.999,99", // Placeholder; can be replaced by API data.
    oldPrice: "IDR 199.999,99", // Placeholder; can be replaced by API data.
    rating: 4.7, // Placeholder; can be replaced by API data.
    reviews: 129, // Placeholder; can be replaced by API data.
    description: // Placeholder; can be replaced by API data.
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    warranty: "Yes", // Placeholder; can be replaced by API data.
    ageGroup: "0-2", // Placeholder; can be replaced by API data.
  };

  return (
    <div className="py-12 px-20 bg-white">
      {/* Product Section */}
      <div className="flex space-x-12 mb-8">
        <div className="w-1/2">
          {/* Placeholder for Image */}
          <Image
            src="/assets/placeholder-large.png" // Placeholder Image
            alt="Item Image"
            width={500}
            height={500}
            className="rounded-lg object-cover"
          />
          <div className="flex space-x-2 mt-4">
            {[1, 2, 3].map((i) => (
              <Image
                key={i}
                src={`/assets/placeholder-small-${i}.png`} // Placeholder Small Images
                alt="Item Image"
                width={150}
                height={150}
                className="rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
        <div className="w-1/2">
          <h1 className="text-heading-xl mb-4">{product.name}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <p className="text-dangerRed font-bold">{product.price}</p>
            <p className="line-through text-body-md text-formGray">{product.oldPrice}</p>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <p className="text-body-lg">{product.rating} ⭐</p>
            <p className="text-body-md text-formGray">({product.reviews} reviews)</p>
          </div>
          {/* Warranty and Age Group */}
          <div className="flex space-x-4 mb-4">
            {/* Uncomment and Replace with API Data */}
            {/* {product.warranty === "Yes" && (
              <span className="text-label-md bg-green px-4 py-2 uppercase text-white">
                Warranty
              </span>
            )}
            {product.ageGroup && (
              <span className="text-label-md bg-gray px-4 py-2 uppercase">
                Age {product.ageGroup}
              </span>
            )} */}
            <span className="warranty-label uppercase bold">Warranty</span>
            <span className="text-label-md bg-formGray px-4 py-2 uppercase bold">Age 0-2</span>
          </div>
          {/* Buttons */}
          <div className="flex flex-col space-y-4 py-10">
            <button className="btn-add-to-cart w-1/2">Add to Cart</button>
            <button className="btn-buy-now w-1/2">Buy Now</button>
          </div>
          <p className="text-body-md">{product.description}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-heading-md text-center mb-8">Reviews</h2>
        <div className="flex space-x-8 mb-8">
          <div className="w-1/3 bg-lightBackground p-6 flex flex-col items-center">
            <p className="text-heading-xl">{product.rating} ⭐</p>
            <p className="text-body-md">({product.reviews} reviews)</p>
          </div>
          <div className="w-2/3 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-darkGray pb-4">
                <div className="flex items-center space-x-4">
                  <p className="text-body-md text-formGray">{i + 2}/5 ⭐</p>
                  <p className="text-body-md">
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua."
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

// Function to Fetch Product Details and Reviews (Commented for now)
// const fetchProductDetails = async () => {
//   const product = await fetch("/api/product-details").then((res) => res.json());
//   const reviews = await fetch("/api/reviews").then((res) => res.json());
//   return { product, reviews };
// };
