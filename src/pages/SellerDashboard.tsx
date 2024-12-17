import { useState } from "react";
import Image from "next/image";
import { PrimaryButton } from "@/components/PrimaryButton";

interface Product {
  id: string;
  name: string;
  sku: string;
  rating: number;
  price: number;
  discount: number;
  finalPrice: number;
  stock: string;
  image: string;
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
      stock: "5/8",
      image: "/assets/placeholder.png",
    },
    {
      id: "2",
      name: "Product Name",
      sku: "123456789",
      rating: 4.5,
      price: 90000,
      discount: 10,
      finalPrice: 81000,
      stock: "5/8",
      image: "/assets/placeholder.png",
    },
  ]);

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleDeactivate = () => {
    const updatedActiveProducts = activeProducts.filter(
      (product) => !selectedProducts.includes(product.id)
    );
    setActiveProducts(updatedActiveProducts);
    setSelectedProducts([]);
  };

  return (
    <div className="body-width mb-[72px] max-md:w-full max-md:px-8">
      {/* Greeting Section */}
      <div className="py-6">
        <span className="text-3xl text-buttonBlue">Hello, Seller Name!</span>
      </div>

      {/* Transaction Summary */}
      <h2 className="text-heading-md font-bold mb-4">Shop Name’s Performance</h2>
      <div className="h-auto border-[2px] border-textBlue rounded-[20px] bg-lightGray rounded-lg flex items-center justify-around p-6 mb-8 w-full">
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
          {["Active Listing", "Available", "Out of Stock", "Deactivated"].map((tab) => (
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
        <hr className="h-[3px] bg-buttonBlue"></hr>

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
                <PrimaryButton type="button">Add Item +</PrimaryButton>
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
                            src={product.image}
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
                        <Image
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

              {/* Pagination */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="btn-primary"
                >
                  Previous
                </button>
                <p>
                  Page {currentPage} of {Math.ceil(activeProducts.length / itemsPerPage)}
                </p>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, Math.ceil(activeProducts.length / itemsPerPage))
                    )
                  }
                  className="btn-primary"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Additional tab contents (Available, Out of Stock, Deactivated) */}
          {activeTab !== "Active Listing" && (
            <div>
              <p className="text-xl text-formGray">No data available for this tab.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;

