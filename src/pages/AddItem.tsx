import { useState } from "react";
import { useSnackbar } from "notistack";

const ListingForm: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const [productDetails, setProductDetails] = useState({
    name: "",
    price: "",
    quantity: 1,
    category: "Toys",
    description: "",
    warranty: "",
    enablePromo: "No",
    discount: "",
    startDate: "",
    endDate: "",
  });
  const [termsChecked, setTermsChecked] = useState(false);
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      if (images.length < 4) {
        setImages([...images, event.target.files[0]]);
      } else {
        enqueueSnackbar("You can only upload a maximum of 4 pictures.", {
          variant: "error",
        });
      }
    }
  };

  const handleImageRemove = (index: number) => {
    const confirmation = confirm("Are you sure you want to delete this image?");
    if (confirmation) {
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
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

  const handleSubmit = async () => {
    const { name, price, category, description, warranty } = productDetails;

    if (
      !name ||
      !price ||
      !category ||
      !description ||
      !warranty ||
      !termsChecked ||
      !declarationChecked
    ) {
      enqueueSnackbar("Please fill all required fields and check all required boxes.", {
        variant: "error",
      });
      return;
    }

    if (
      productDetails.enablePromo === "Yes" &&
      (!productDetails.discount || !productDetails.startDate || !productDetails.endDate)
    ) {
      enqueueSnackbar("Please complete all promo fields.", {
        variant: "error",
      });
      return;
    }

    try {
      setLoading(true);
      enqueueSnackbar("Product submitted successfully!", {
        variant: "success",
      });
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      enqueueSnackbar("Failed to submit product.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductDetails({
      name: "",
      price: "",
      quantity: 1,
      category: "Toys",
      description: "",
      warranty: "",
      enablePromo: "No",
      discount: "",
      startDate: "",
      endDate: "",
    });
    setImages([]);
    setTermsChecked(false);
    setDeclarationChecked(false);
  };

  return (
    <div className="p-8 mt-10 bg-white min-h-screen max-w-[1440px]">
      <h2 className="text-heading-xl font-bold mb-8">What are you listing today?</h2>
      <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">

        {/* Left Side - Picture Upload */}
        <div className="flex flex-col space-y-4 w-full lg:w-1/2">
          {/* Main Image */}
          <div
            className="bg-gray-300 relative w-full h-[300px] md:h-[400px] lg:h-[500px] flex justify-center items-center cursor-pointer hover:bg-gray-400 rounded-lg"
            onClick={handlePromptUpload}
          >
            {images[0] ? (
              <div className="relative w-full h-full">
                <img
                  src={URL.createObjectURL(images[0])}
                  alt="Uploaded"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  className="absolute bottom-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
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
              </div>
            ) : (
              <p className="text-gray-500 text-lg">Select photos</p>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex space-x-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-300 relative w-[100px] h-[100px] md:w-[150px] md:h-[150px] flex justify-center items-center cursor-pointer hover:bg-gray-400 rounded-lg"
                onClick={handlePromptUpload}
              >
                {images[index + 1] ? (
                  <div className="relative w-full h-full">
                    <img
                      src={URL.createObjectURL(images[index + 1])}
                      alt="Uploaded"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      className="absolute bottom-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
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
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">+</p>
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
        <div className="p-6 border border-textBlue rounded-lg w-full lg:w-1/2">
          <h3 className="text-heading-xl font-bold mb-6">Product Details</h3>
          <div className="space-y-4">
            {/* Product Name */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center">
              <label className="w-full lg:w-1/4 text-textBlue">Product name</label>
              <input
                type="text"
                value={productDetails.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-2 py-1"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center">
              <label className="w-full lg:w-1/4 text-textBlue">Price (IDR)</label>
              <input
                type="number"
                value={productDetails.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-2 py-1"
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center">
              <label className="w-full lg:w-1/4 text-textBlue">Quantity</label>
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
              <input
                type="checkbox"
                checked={termsChecked}
                onChange={(e) => setTermsChecked(e.target.checked)}
                className="mr-2"
              />
              <label>
                I have read the{" "}
                <a href="#" className="text-textBlue">
                  Terms and Agreements policy
                </a>
              </label>
            </div>

            {/* Declaration */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={declarationChecked}
                onChange={(e) => setDeclarationChecked(e.target.checked)}
                className="mr-2"
              />
              <label>
                I hereby declare that all information provided is accurate and
                valid.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSubmit}
              className="bg-textBlue text-white px-6 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingForm;