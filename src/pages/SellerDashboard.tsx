import { useState } from "react";
import Image from "next/image";
import { PrimaryButton } from "@/components/PrimaryButton";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  sku: string;
  rating: number;
  price: number;
  discount: number;
  finalPrice: number;
  stock: string;
  image_url: string | null;
  category: string | null;
  ageCategory: string | null;
  warranty: string | null;
  enablePromo: string | null;
  startDate: Date | null;
  endDate: Date | null;
  description: string | null;
}

const SellerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Active Listing");
  const [activeProducts, setActiveProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Product Name",
      sku: "123456789",
      rating: 4.5,
      price: 90000,
      discount: 10,
      finalPrice: 81000,
      stock: "5",
      image_url: "/assets/logo_main.png",
      category: null,
     ageCategory: null,
    warranty: null,
    enablePromo: null,
    startDate: null,
    endDate: null,
    description: null,
    },
    {
      id: "2",
      name: "Product Name",
      sku: "123456789",
      rating: 4.5,
      price: 90000,
      discount: 10,
      finalPrice: 81000,
      stock: "5",
      image_url: "/assets/logo_main.png",
      category: null,
     ageCategory: null,
    warranty: null,
    enablePromo: null,
    startDate: null,
    endDate: null,
    description: null,
    },
  ]);

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [productDetails, setProductDetails] = useState<Product | null>(null);

  const itemsPerPage = 10;

  const paginatedProducts = activeProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((productId) => productId !== id) : [...prev, id]
    );
  };

  const handleEditProduct = (product: Product) => {
    setProductDetails(product);
    setShowEditModal(true);
  };

  const handleInputChange = (field: keyof Product, value: string | number) => {
    setProductDetails((prev) => prev && { ...prev, [field]: value });
  };

  const handleUpdateProduct = () => {
    if (!productDetails) return;

    setActiveProducts((prev) =>
      prev.map((product) =>
        product.id === productDetails.id ? productDetails : product
      )
    );
    setShowEditModal(false);
    alert("Product updated successfully!");
  };

  return (
    <div className="body-width mb-[72px] max-md:w-full max-md:px-8">
      {/* Greeting Section */}
      <div className="py-6">
        <span className="text-3xl text-buttonBlue">Hello, Seller Name!</span>
      </div>

      {/* Transaction Summary */}
      <h2 className="text-heading-md font-bold mb-4">Shop Name’s Performance</h2>
      <div className="h-auto border-[2px] border-textBlue rounded-[20px] bg-lightGray flex items-center justify-around p-6 mb-8 w-full">
        <div className="text-center">
          <p className="text-heading-xl font-bold">IDR 5,78M</p>
          <p className="text-body-md">Lifetime revenue</p>
        </div>
        <div className="text-center">
          <p className="text-heading-xl font-bold">12</p>
          <p className="text-body-md">Items sold</p>
        </div>
        <div className="text-center">
          <p className="text-heading-xl font-bold">50</p>
          <p className="text-body-md">Items listed</p>
        </div>
        <div className="text-center">
          <p className="text-heading-xl font-bold">4</p>
          <p className="text-body-md">Months active</p>
        </div>
      </div>

      {/* Main Dashboard Section */}
      <div className="h-auto border-[2px] border-textBlue rounded-[20px] bg-lightGray">
        {/* Tabs */}
        <div className="flex gap-14 px-6 py-8 text-2xl text-buttonBlue">
          {["Active Listing", "Out of Stock"].map((tab) => (
            <span
              key={tab}
              className={`cursor-pointer ${
                activeTab === tab ? "text-black font-bold" : ""
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </span>
          ))}
        </div>
        <hr className="h-[3px] bg-buttonBlue" />

        <div className="p-6">
          {activeTab === "Active Listing" && (
            <div className="p-6 rounded-lg">
              {/* Search Bar and Add Item Button */}
              <div className="flex justify-between items-center mb-6">
                <input
                  type="text"
                  placeholder="Find products/SKUs"
                  className="w-366 p-2 border border-formGray rounded-md"
                />
                <Link href="/AddItem" passHref>
  <PrimaryButton type="button">Add Item +</PrimaryButton>
</Link>
              </div>

              {/* Product Table */}
              <table className="w-full text-left border-collapse mb-6">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts(
                              paginatedProducts.map((product) => product.id)
                            );
                          } else {
                            setSelectedProducts([]);
                          }
                        }}
                        checked={selectedProducts.length === paginatedProducts.length}
                      />
                    </th>
                    <th>Product Name</th>
                    <th>Rating</th>
                    <th>Price</th>
                    <th>Disc</th>
                    <th>Final Price</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                        />
                      </td>
                      <td>
                        <div className="flex items-center">
                          <Image
                            src={product.image_url || "/assets/logo_main.png"}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="rounded-md"
                          />
                          <div className="ml-4">
                            <p className="font-bold">{product.name}</p>
                            <p className="text-formGray text-sm">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td>{product.rating}</td>
                      <td>IDR {product.price.toLocaleString()}</td>
                      <td>{product.discount}%</td>
                      <td>IDR {product.finalPrice.toLocaleString()}</td>
                      <td>{product.stock}</td>
                      <td>
                          <Image onClick={() => handleEditProduct(product)}
                            src="/assets/edit.png"
                            alt="Edit"
                            width={20}
                            height={20}
                            className="cursor-pointer"
                          />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      
      {showEditModal && productDetails && (
  <div className="modal-overlay">
  <div className="modal-content">
      <h3 className="text-heading-md font-bold mb-4">Product Details</h3>
      <div className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block font-bold text-gray-700">Product name</label>
          <input
            type="text"
            value={productDetails.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-bold text-gray-700">Price (IDR)</label>
          <input
            type="number"
            value={productDetails.price}
            onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block font-bold text-gray-700 mb-1">Quantity</label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() =>
                handleInputChange("stock", Math.max(1, Number(productDetails.stock) - 1))
              }
              className="bg-black text-white px-3 py-1 rounded-md"
            >
              -
            </button>
            <span>{productDetails.stock}</span>
            <button
              type="button"
              onClick={() => handleInputChange("stock", Number(productDetails.stock) + 1)}
              className="bg-black text-white px-3 py-1 rounded-md"
            >
              +
            </button>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block font-bold text-gray-700">Category</label>
          <select
            value={productDetails.category || "Toys"}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="Toys">Toys</option>
            <option value="Stroller">Stroller</option>
            <option value="Carrier">Carrier</option>
            <option value="Furniture">Furniture</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block font-bold text-gray-700">Description</label>
          <textarea
            value={productDetails.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full border p-2 rounded"
          ></textarea>
        </div>

        {/* Age Category */}
        <div>
          <label className="block font-bold text-gray-700">Age Category</label>
          <div className="flex space-x-4">
            {["0-2", "3-5", "All ages"].map((age) => (
              <label key={age}>
                <input
                  type="radio"
                  value={age}
                  checked={productDetails.ageCategory === age}
                  onChange={(e) => handleInputChange("ageCategory", e.target.value)}
                />{" "}
                {age}
              </label>
            ))}
          </div>
        </div>

        {/* Warranty */}
        <div>
          <label className="block font-bold text-gray-700">Warranty</label>
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

        <hr className="border-t-2 border-gray-300 my-4" />

        {/* Enable Promo */}
        <div>
          <label className="block font-bold text-gray-700">Enable Promo?</label>
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

        {/* Discount and Promo Dates */}
        <div className="space-y-2">
          <div>
            <label className="block font-bold text-gray-700">Discount (%)</label>
            <input
              type="number"
              value={productDetails.discount || ""}
              onChange={(e) => handleInputChange("discount", e.target.value)}
              disabled={productDetails.enablePromo === "No"}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700">Start Date</label>
            <input
              type="date"
              value={productDetails.startDate || ""}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              disabled={productDetails.enablePromo === "No"}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700">End Date</label>
            <input
              type="date"
              value={productDetails.endDate || ""}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              disabled={productDetails.enablePromo === "No"}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Terms and Declaration */}
        <div className="space-y-2">
          <label>
            <input type="checkbox" className="mr-2" /> I have read the{" "}
            <a href="#" className="text-blue-600">
              Terms and Agreements policy
            </a>
          </label>
          <p></p>
          <label>
            <input type="checkbox" className="mr-2" /> I hereby declare that all
            information provided is accurate and valid.
          </label>
        </div>

        {/* Submit Button */}

        <div className="flex justify-end space-x-4 mt-4">
  <button
    onClick={() => setShowEditModal(false)}
    className="px-4 py-2 border rounded"
  >
    Cancel
  </button>
  <button
    onClick={handleUpdateProduct}
    className="px-4 py-2 bg-buttonBlue text-white rounded"
  >
    Save Changes
  </button>
</div>


        
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default SellerDashboard;
