import { useState } from "react";

const ListingForm: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [productDetails, setProductDetails] = useState({
    name: "",
    price: "",
    quantity: 1,
    category: "Toys",
    description: "",
    ageCategory: "",
    warranty: "",
    enablePromo: "No",
    discount: "",
    startDate: "",
    endDate: "",
  });
  const [termsChecked, setTermsChecked] = useState(false);
  const [declarationChecked, setDeclarationChecked] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      if (images.length < 4) {
        setImages([...images, event.target.files[0]]);
      } else {
        alert("You can only upload a maximum of 4 pictures.");
      }
    }
  };

  const handleImageRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePromptUpload = () => {
    const input = document.getElementById("imageInput") as HTMLInputElement;
    input?.click();
  };

  const handleQuantityChange = (amount: number) => {
    setProductDetails((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + amount),
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setProductDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const { name, price, category, description, ageCategory, warranty } =
      productDetails;

    if (
      !name ||
      !price ||
      !category ||
      !description ||
      !ageCategory ||
      !warranty ||
      !termsChecked ||
      !declarationChecked
    ) {
      alert("Please fill all required fields and check all required boxes.");
      return;
    }

    if (
      productDetails.enablePromo === "Yes" &&
      (!productDetails.discount || !productDetails.startDate || !productDetails.endDate)
    ) {
      alert("Please complete all promo fields.");
      return;
    }

    alert("Form submitted successfully!");
  };

  return (
    <div className="p-8 mt-10 bg-white min-h-screen max-w-[1440px]">
      <h2 className="text-heading-xl font-bold mb-8">What are you listing today?</h2>
      <div className="flex space-x-8">
        {/* Left Side - Picture Upload */}
        <div className="flex flex-col space-y-4">
          {/* Main Image */}
          <div
            className="bg-gray-300 relative w-[500px] h-[500px] flex justify-center items-center cursor-pointer hover:bg-gray-400 rounded-lg"
            onClick={handlePromptUpload}
          >
            {images[0] ? (
              <img
                src={URL.createObjectURL(images[0])}
                alt="Uploaded"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <p className="text-gray-500 text-lg">Select photos</p>
            )}
            {images[0] && (
              <button
                className="absolute bottom-2 right-2 hidden hover:block"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageRemove(0);
                }}
              >
                <img
                  src="/assets/remove.png"
                  alt="Remove"
                  className="w-6 h-6"
                />
              </button>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex space-x-4 w-[500px]">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-300 relative w-[150px] h-[150px] flex justify-center items-center cursor-pointer hover:bg-gray-400 rounded-lg"
                onClick={handlePromptUpload}
              >
                {images[index + 1] ? (
                  <img
                    src={URL.createObjectURL(images[index + 1])}
                    alt="Uploaded"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <p className="text-gray-500 text-sm">+</p>
                )}
                {images[index + 1] && (
                  <button
                    className="absolute bottom-2 right-2 hidden hover:block"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageRemove(index + 1);
                    }}
                  >
                    <img
                      src="/assets/remove.png"
                      alt="Remove"
                      className="w-4 h-4"
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Right Side - Form */}
        <div className="p-6 border border-textBlue rounded-lg" style={{ width: "720px" }}>
          <h3 className="text-heading-xl font-bold mb-6">Product Details</h3>
          <div className="space-y-4">
            {/* Product Name */}
            <div className="flex items-center">
              <label className="w-1/4 text-textBlue">Product name</label>
              <input
                type="text"
                value={productDetails.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-2 py-1"
              />
            </div>

            {/* Price */}
            <div className="flex items-center">
              <label className="w-1/4 text-textBlue">Price (IDR)</label>
              <input
                type="number"
                value={productDetails.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-2 py-1"
              />
            </div>

            {/* Quantity */}
            <div className="flex items-center">
              <label className="w-1/4 text-textBlue">Quantity</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="bg-black text-white px-3 py-1 rounded-md"
                >
                  -
                </button>
                <span>{productDetails.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="bg-black text-white px-3 py-1 rounded-md"
                >
                  +
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center">
              <label className="w-1/4 text-textBlue">Category</label>
              <select
                value={productDetails.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="Toys">Toys</option>
                <option value="Stroller">Stroller</option>
                <option value="Carrier">Carrier</option>
                <option value="Furniture">Furniture</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Description */}
            <div className="flex items-center">
              <label className="w-1/4 text-textBlue">Description</label>
              <textarea
                value={productDetails.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-2 py-1"
              ></textarea>
            </div>

            {/* Age Category */}
            <div className="flex items-center">
              <label className="w-1/4 text-textBlue">Age Category</label>
              <div className="flex space-x-4">
                <label>
                  <input
                    type="radio"
                    value="0-2"
                    checked={productDetails.ageCategory === "0-2"}
                    onChange={(e) => handleInputChange("ageCategory", e.target.value)}
                  />{" "}
                  0-2
                </label>
                <label>
                  <input
                    type="radio"
                    value="3-5"
                    checked={productDetails.ageCategory === "3-5"}
                    onChange={(e) => handleInputChange("ageCategory", e.target.value)}
                  />{" "}
                  3-5
                </label>
                <label>
                  <input
                    type="radio"
                    value="All ages"
                    checked={productDetails.ageCategory === "All ages"}
                    onChange={(e) => handleInputChange("ageCategory", e.target.value)}
                  />{" "}
                  All ages
                </label>
              </div>
            </div>

            {/* Warranty */}
            <div className="flex items-center">
              <label className="w-1/4 text-textBlue">Warranty</label>
              <div className="flex space-x-4">
                <label>
                  <input
                    type="radio"
                    value="Yes"
                    checked={productDetails.warranty === "Yes"}
                    onChange={(e) => handleInputChange("warranty", e.target.value)}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    value="No"
                    checked={productDetails.warranty === "No"}
                    onChange={(e) => handleInputChange("warranty", e.target.value)}
                  />{" "}
                  No
                </label>
              </div>
            </div>

            <hr className="border-t-2 border-textBlue my-4" />

            {/* Enable Promo */}
            <div className="flex items-center">
              <label className="w-1/4 text-textBlue">Enable Promo?</label>
              <div className="flex space-x-4">
                <label>
                  <input
                    type="radio"
                    value="Yes"
                    checked={productDetails.enablePromo === "Yes"}
                    onChange={(e) => handleInputChange("enablePromo", e.target.value)}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    value="No"
                    checked={productDetails.enablePromo === "No"}
                    onChange={(e) => handleInputChange("enablePromo", e.target.value)}
                  />{" "}
                  No
                </label>
              </div>
            </div>

            {/* Discount */}
            <div className="flex items-center">
              <label className="w-1/4 text-textBlue">Discount (%)</label>
              <input
                type="number"
                value={productDetails.discount}
                onChange={(e) => handleInputChange("discount", e.target.value)}
                disabled={productDetails.enablePromo === "No"}
                className="flex-1 border border-gray-300 rounded-md px-2 py-1"
              />
            </div>

            {/* Start Date */}
            <div className="flex items-center">
              <label className="w-1/4 text-textBlue">Start Date</label>
              <input
                type="date"
                value={productDetails.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                disabled={productDetails.enablePromo === "No"}
                className="flex-1 border border-gray-300 rounded-md px-2 py-1"
              />
            </div>

            {/* End Date */}
            <div className="flex items-center">
              <label className="w-1/4 text-textBlue">End Date</label>
              <input
                type="date"
                value={productDetails.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                disabled={productDetails.enablePromo === "No"}
                className="flex-1 border border-gray-300 rounded-md px-2 py-1"
              />
            </div>

            {/* Terms */}
            <div className="flex items-center">
              <label className="w-1/4"></label>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                  />{" "}
                  I have read the <a href="#" className="text-textBlue">Terms and Agreements policy</a>
                </label>
              </div>
            </div>

            {/* Declaration */}
            <div className="flex items-center">
              <label className="w-1/4"></label>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={declarationChecked}
                    onChange={(e) => setDeclarationChecked(e.target.checked)}
                  />{" "}
                  I hereby declare that all information provided is accurate and valid.
                </label>
              </div>
            </div>
          </div>

         {/* Submit Button */}
         <div className="flex justify-center mt-6">
            <button
              onClick={handleSubmit}
              className="bg-textBlue text-white px-6 py-2 rounded-md"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingForm;