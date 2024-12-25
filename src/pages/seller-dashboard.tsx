import { useState, useEffect } from "react";
import Image from "next/image";
import { PrimaryButton } from "@/components/PrimaryButton";
import Link from "next/link";
import { API_URL, API_URL_LOCAL } from "@/constants/apis";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/Spinner";


interface Product {
  id: number;
  name: string;
  sku: string;
  rating: number | string; // For "No reviews yet"
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  image_url: string | null;
  category: string | null;
  ageCategory: string | null;
  warranty: string | null;
  enablePromo: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

const SellerDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Active Listing");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [productDetails, setProductDetails] = useState<Product | null>(null);
  const [sellerPerformance, setSellerPerformance] = useState({
    revenue: 0,
    itemsSold: 0,
    itemsListed: 0,
    averageRating: 0,
  });
  const [offset, setOffset] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSellerPerformance();
      // fetchActiveListings();
      fetchActiveListingsV2();
    }
  }, [user]);

  const fetchSellerPerformance = async () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const sellerResponse = await fetch(`${API_URL_LOCAL}/sellers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sellerResult = await sellerResponse.json();
      const sellerData = sellerResult || [];

      const currentSeller = sellerData.find(
        (seller: any) => seller.user_id === user?.data.id
      );

      if (!currentSeller) {
        console.error("Current seller not found for user ID:", user?.data.id);
        setSellerPerformance({
          revenue: 0,
          itemsSold: 0,
          itemsListed: 0,
          averageRating: 0,
        });
        return;
      }

      const transactionResponse = await fetch(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const transactionResult = await transactionResponse.json();
      const transactionData = transactionResult || [];

      const sellerTransactions = transactionData.filter(
        (transaction: any) => transaction.seller_id === currentSeller.id
      );

      const revenue = sellerTransactions.reduce(
        (total: number, t: any) => total + t.total_price,
        0
      );

      const itemsSold = sellerTransactions.reduce(
        (total: number, t: any) => total + t.quantity,
        0
      );

      setSellerPerformance((prev) => ({
        ...prev,
        revenue,
        itemsSold,
      })); // itemsListed will be set by fetchActiveListings
    } catch (error) {
      console.error("Error fetching seller performance:", error);
    }
  };

  const fetchActiveListingsV2 = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }


      const response = await fetch(`${API_URL_LOCAL}/sellers/products/v3`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch active listings");
      }
      const productsArray = await Promise.all(
          result.map(async (product: any) => {
            let discount = 0;
            let rating: number | string = "No reviews yet"; // Adjust type here

            discount = parseFloat(product.discount_percentage) || 0;
            rating = parseFloat(
              (
                result.reduce((acc: number, r: any) => acc + r.rating, 0) /
                result.length
              ).toFixed(1)
            );
            return {
              ...product,
              discount,
              finalPrice: product.price - product.price * (discount / 100),
              rating,
            };
          })
        );

      // Set products for display
      setProducts(productsArray);
      // Update itemsListed in sellerPerformance
      setSellerPerformance((prev) => ({
        ...prev,
        itemsListed: productsArray.length,
      }));
    } catch (error) {
      console.error("Error fetching active listings:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleEditProduct = (product: Product) => {
    setProductDetails(product);
    setShowEditModal(true);
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    setProductDetails((prev) => prev && { ...prev, [field]: value });
  };

  const handleUpdateProduct = async () => {
    if (!productDetails) return;

    try {
      const productResponse = await fetch(
        `${API_URL}/products/${productDetails.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(productDetails),
        }
      );

      if (!productResponse.ok) throw new Error("Failed to update product.");

      // Update discount table
      if (productDetails.enablePromo === "Yes") {
        await fetch(`${API_URL}/discount`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            product_id: productDetails.id,
            discount_percentage: productDetails.discount,
            start_date: productDetails.startDate,
            end_date: productDetails.endDate,
          }),
        });
      }

      fetchActiveListingsV2();
      setShowEditModal(false);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  const paginatedProducts = products.filter(
    (product) =>
      activeTab === "Active Listing"
        ? product.stock > 0
        : product.stock === 0
  );
  
  const handlePage = (direction: string) => {
    const currentDataLength = products?.length || products.length;

    if (direction === "next" && offset + limitPagination < currentDataLength) {
      setOffset((prev) => prev + limitPagination);
    } else if (direction === "prev" && offset > 0) {
      setOffset((prev) => prev - limitPagination);
    }
  };

  let limitPagination = 10;
  const totalPages = Math.ceil((products?.length || products.length) / limitPagination);
  const currentPage = Math.floor(offset / limitPagination) + 1;

  const currentPageData =
  Array.isArray(products) && products.length > 0
    ? products.slice(offset, offset + limitPagination)
    : products.slice(offset, offset + limitPagination);



  return (
    <div className="body-width mb-[72px] max-md:w-full max-md:px-8">
      {/* Greeting Section */}
      <div className="py-6">
        <span className="text-3xl text-buttonBlue">
          Hello, {user?.data.username}!
        </span>
      </div>

      {/* Transaction Summary */}
      <h2 className="text-heading-md font-bold mb-4">Shop Name’s Performance</h2>
      <Link href="/seller-transaction" passHref>
        <PrimaryButton type="button">Show Full Transactions</PrimaryButton>
      </Link>

      <div className="h-auto border-[2px] border-textBlue rounded-[20px] bg-lightGray flex items-center justify-around p-6 my-8 w-full">
        <div className="text-center">
          <p className="text-heading-xl font-bold">
            IDR {sellerPerformance.revenue.toLocaleString()}
          </p>
          <p className="text-body-md">Lifetime revenue</p>
        </div>
        <div className="text-center">
          <p className="text-heading-xl font-bold">{sellerPerformance.itemsSold}</p>
          <p className="text-body-md">Items sold</p>
        </div>
        <div className="text-center">
          <p className="text-heading-xl font-bold">{sellerPerformance.itemsListed}</p>
          <p className="text-body-md">Items listed</p>
        </div>
        <div className="text-center">
          <p className="text-heading-xl font-bold">
            {sellerPerformance.averageRating.toFixed(1)}
          </p>
          <p className="text-body-md">Average Rating</p>
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
              onClick={() => setActiveTab(tab)}
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
              <table className="w-full text-left border-collapse mb-6 text-body-md">
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
                    <th>Discount</th>
                    <th>Final Price</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                      <tr>
                      <td className="w-[450%] h-[400%] flex justify-center items-center">
                        <Spinner />
                      </td>
                    </tr>
                 
                  ) : currentPageData.length > 0 ? (
                    currentPageData.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() =>
                              setSelectedProducts((prev) =>
                                prev.includes(product.id)
                                  ? prev.filter((id) => id !== product.id)
                                  : [...prev, product.id]
                              )
                            }
                          />
                        </td>
                        <td>
                          <div className="flex p-6 items-center">
                            <Image
                              src={product.image_url || "/assets/placeholder_image.jpg"}
                              alt={product.name}
                              width={50}
                              height={50}
                              className="rounded-md"
                            />
                            <div className="ml-4">
                              <p className="font-bold">{product.name}</p>
                            </div>
                          </div>
                        </td>
                        <td>{typeof product.rating === "number" ? product.rating : "No reviews yet"}</td>
                        <td>IDR {product.price.toLocaleString()}</td>
                        <td>{product.discount}%</td>
                        <td>IDR {product.finalPrice.toLocaleString()}</td>
                        <td>{product.stock}</td>
                        <td>
                          <Image
                            onClick={() => handleEditProduct(product)}
                            src="/assets/edit.png"
                            alt="Edit"
                            width={20}
                            height={20}
                            className="cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-4">
                        No products available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="flex justify-end space-x-6 py-8 my-4">
              <div>
                <img
                  src="/Polygon_2.png"
                  onClick={() => handlePage("prev")}
                  className={
                    currentPage === 1 ? "cursor-not-allowed opacity-20" : ""
                  }
                />
              </div>
              <div>
                Showing page {currentPage} from total of {totalPages} pages
              </div>
              <div>
                <img
                  src="/Polygon_3.png"
                  onClick={() => handlePage("next")}
                  className={
                    currentPage === totalPages
                      ? "cursor-not-allowed opacity-20"
                      : ""
                  }
                />
              </div>
            </div>
            </div>
          )}

          {activeTab === "Out of Stock" && (
            <div className="p-6 rounded-lg">
              <h3 className="text-heading-md font-bold mb-4">Out of Stock Products</h3>
              {paginatedProducts.length === 0 ? (
                <p className="text-gray-600">No out-of-stock products to display.</p>
              ) : (
                <table className="w-full text-left border-collapse mb-6 text-body-md">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>IDR {product.price.toLocaleString()}</td>
                        <td>{product.stock}</td>
                        <td>
                          <Image
                            onClick={() => handleEditProduct(product)}
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
              )}
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
