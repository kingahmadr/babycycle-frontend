import { GetServerSideProps } from "next";

const ProductDetailsPage: React.FC = () => {
  const product = {
    name: "PRODUCT NAME",
    price: "IDR 99.999,99",
    oldPrice: "IDR 199.999,99",
    rating: 4.7,
    reviews: 129,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    category: "Toys",
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Product Section */}
      <div className="flex space-x-8 mb-8">
        <div className="bg-babyBlue w-1/3 h-64 rounded-lg"></div>
        <div className="w-2/3">
          <h1 className="text-heading-xl mb-2">{product.name}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <p className="text-dangerRed font-bold">{product.price}</p>
            <p className="line-through text-body-md text-formGray">{product.oldPrice}</p>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <p className="text-body-lg">{product.rating} ⭐</p>
            <p className="text-body-md text-formGray">({product.reviews} reviews)</p>
          </div>
          <div className="flex space-x-4 mb-4">
            <span className="warranty-label">WARRANTY</span>
            <span className="text-label-md bg-lightBackground px-4 py-2 rounded-lg uppercase">Age 0-2</span>
          </div>
          <p className="text-body-md mb-6">{product.description}</p>
          <div className="flex space-x-4">
            <button className="btn-add-to-cart">Add to Cart</button>
            <button className="btn-buy-now">Buy Now</button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="flex space-x-4 mb-8">
        <div className="bg-babyBlue w-16 h-16 rounded-lg"></div>
        <div className="bg-babyBlue w-16 h-16 rounded-lg"></div>
        <div className="bg-babyBlue w-16 h-16 rounded-lg"></div>
        <div className="bg-babyBlue w-16 h-16 rounded-lg"></div>
      </div>

      {/* Reviews Section */}
      <div>
        <h2 className="text-heading-md mb-4">Reviews</h2>
        <div className="flex space-x-4 mb-6">
          <div className="w-1/4 bg-babyBlue p-4 rounded-lg">
            <p className="text-heading-md">{product.rating} ⭐</p>
            <p className="text-body-md">{product.reviews} reviews</p>
            <p className="text-body-sm text-formGray">Average Rating</p>
          </div>
          <div className="w-3/4 space-y-4">
            <div className="border border-formGray p-4 rounded-lg">
              <p className="text-body-md">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</p>
            </div>
            <div className="border border-formGray p-4 rounded-lg">
              <p className="text-body-md">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</p>
            </div>
            <div className="border border-formGray p-4 rounded-lg">
              <p className="text-body-md">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</p>
            </div>
            <div className="border border-formGray p-4 rounded-lg">
              <p className="text-body-md">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

  