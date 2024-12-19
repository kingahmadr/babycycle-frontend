import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/constants/apis";
import axios from "axios";

const ListingForm: React.FC = () => {
  const [images, setImage] = useState<File>();
  const { enqueueSnackbar } = useSnackbar();
  const { user, isAuthenticated } = useAuth();
  const [imageUrl, setImageUrl] = useState<string>("");

  const [productDetails, setProductDetails] = useState({
    name: "",
    price: "",
    quantity: 1,
    category: "Toys",
    description: "",
    warranty: "No",
    enablePromo: "No",
    discount: "",
    startDate: "",
    endDate: "",
  });

  const [termsChecked, setTermsChecked] = useState(false);
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_KEY = 'dce66a7b2cfd67c8a37ccaa5e1dc990b';

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setImage(file)
      // Upload to Imgbb
      const formData = new FormData()
      formData.append('image', file)
      const fixImageUrl = (url: string): string => {
        return url.replace('https://i.ibb.co/', 'https://i.ibb.co.com/')
      }
      try {
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?expiration=600&key=${API_KEY}`,
          formData
        )
        if (response.data.success) {
          let uploadedUrl = response.data.data.url
          uploadedUrl = fixImageUrl(uploadedUrl)
          setImageUrl(uploadedUrl)
          enqueueSnackbar('Image uploaded successfully!', {
            variant: 'success'
          })
        } else {
          enqueueSnackbar('Image upload failed. Please try again.', {
            variant: 'error'
          })
        }
      } catch (error) {
        console.error('Image upload error:', error)
        enqueueSnackbar('An error occurred while uploading the image.', {
          variant: 'error'
        })
      }
    } else {
      enqueueSnackbar('You can only upload a maximum of 4 pictures.', {
        variant: 'error'
      })
    }
  }

  const handlePromptUpload = () => {
    const input = document.getElementById("imageInput") as HTMLInputElement;
    input?.click();
  };

  const handleImageRemove = () => {
    const confirmation = confirm("Are you sure you want to delete this image?");
    if (confirmation) {
      setImageUrl("");
    }
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
    if (!isAuthenticated || !user?.data) {
      enqueueSnackbar("You must be logged in to list a product.", {
        variant: "error",
      });
      return;
    }

    if (!user?.data.is_seller) {
      enqueueSnackbar("You must register as a seller to list products.", {
        variant: "error",
      });
      return;
    }

    const { name, price, category, description, warranty, quantity } = productDetails;

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

    const productPayload = {
      name,
      price: parseFloat(price),
      stock: quantity,
      category,
      descriptions: description,
      is_warranty: warranty === "Yes",
      image_url: imageUrl, // Added image_url to the payload
    };

    try {
      setLoading(true);
      const productResponse = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(productPayload),
      });

      if (!productResponse.ok) {
        const errorText = await productResponse.text();
        console.error("Product creation failed:", errorText);
        enqueueSnackbar("Failed to create product. Please try again.", {
          variant: "error",
        });
        return;
      }

      const createdProduct = await productResponse.json();
      enqueueSnackbar("Product added successfully!", { variant: "success" });

      if (productDetails.enablePromo === "Yes") {
        const discountPayload = {
          product_id: createdProduct.id,
          discount_percentage: parseFloat(productDetails.discount),
          start_date: productDetails.startDate,
          end_date: productDetails.endDate,
          is_active: true,
        };

        const discountResponse = await fetch(`${API_URL}/discount`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(discountPayload),
        });

        if (!discountResponse.ok) {
          enqueueSnackbar("Failed to add discount. Please try again.", {
            variant: "error",
          });
          return;
        }

        enqueueSnackbar("Discount added successfully!", { variant: "success" });
      }

      resetForm();
    } catch (error) {
      console.error("Error submitting product or discount:", error);
      enqueueSnackbar("Failed to submit product or discount.", { variant: "error" });
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
      warranty: "No",
      enablePromo: "No",
      discount: "",
      startDate: "",
      endDate: "",
    });
    setImageUrl("");
    setTermsChecked(false);
    setDeclarationChecked(false);
  };
  
  return (
    <div className="p-8 mt-10 bg-white min-h-screen xl:min-w-[1440px] lg:min-w-[900px] md:min-w-[600]">
      <h2 className="text-heading-xl font-bold mb-8">What are you listing today?</h2>
      <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">

        {/* Left Side - Picture Upload */}
        <div className="flex flex-col space-y-4 w-full lg:w-1/2">
          
          {/* Main Image */}
          <div
            className="bg-gray-300 relative max-w-[600] flex justify-center items-center cursor-pointer hover:bg-gray-400 rounded-lg"
            onClick={handlePromptUpload}
          >
            {images ? (
              <div className="relative w-full h-full">
                <img
                  src={URL.createObjectURL(images)}
                  alt="Uploaded"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  className="absolute bottom-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageRemove();
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-lg">Select photos</p>
            )}
          </div>

          {/* <div
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
          </div> */}


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