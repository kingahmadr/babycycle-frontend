import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/constants/apis";

const SellerTransactionDashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch transactions:", response.status, response.statusText);
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      const transactionData = result || [];

      // Filter transactions for the current seller
      const sellerResponse = await fetch(`${API_URL}/sellers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sellerResult = await sellerResponse.json();
      const sellerData = sellerResult || [];
      const currentSeller = sellerData.find((seller: any) => seller.user_id === user?.data.id);

      if (!currentSeller) {
        console.error("Current seller not found");
        setTransactions([]);
        setIsLoading(false);
        return;
      }

      const filteredTransactions = transactionData.filter(
        (transaction: any) => transaction.seller_id === currentSeller.id
      );

      setTransactions(filteredTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="body-width mb-[72px] max-md:w-full max-md:px-8">
      {/* Greeting Section */}
      <div className="py-6">
        <span className="text-3xl text-buttonBlue">Hello, {user?.data.username}!</span>
      </div>

      {/* Transaction Table Section */}
      <h2 className="text-heading-md font-bold mb-4">Seller Transactions</h2>
      {isLoading ? (
        <p className="text-center text-textBlue">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-center text-textBlue">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-md">
            <thead className="bg-textBlue text-white">
              <tr>
                <th className="p-4 text-left rounded-tl-lg">Product Name</th>
                <th className="p-4 text-left">Quantity</th>
                <th className="p-4 text-left">Total Price</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left rounded-tr-lg">User Address</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr
                  key={transaction.checkout_id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200`}
                >
                  <td className="p-4 border-b">{transaction.name}</td>
                  <td className="p-4 border-b">{transaction.quantity}</td>
                  <td className="p-4 border-b">IDR {transaction.total_price.toLocaleString()}</td>
                  <td className="p-4 border-b">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 border-b">{transaction.user_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerTransactionDashboard;

