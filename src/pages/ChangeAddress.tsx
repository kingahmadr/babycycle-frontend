import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
}

const ChangeAddress: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [editAddress, setEditAddress] = useState<Address | null>(null);

  // Simulate fetch addresses based on user.id (placeholder for API integration)
  useEffect(() => {
    const fetchAddresses = async () => {
      const userAddresses: Address[] = [
        {
          id: "1",
          name: user?.username || "Guest",
          phone: user?.phone || "No phone number",
          address: user?.address || "No address available",
        },
        {
          id: "2",
          name: "Maria Mercedez",
          phone: "08534326787",
          address:
            "Balai Diklat Industri Denpasar, Jalan WR. Supratman, Denpasar, Bali",
        },
        {
          id: "3",
          name: "John Doe",
          phone: "08512345678",
          address: "123 Main Street, Central Jakarta, DKI Jakarta",
        },
      ];
      setAddresses(userAddresses);
      setSelectedAddressId(userAddresses[0]?.id || "");
    };

    fetchAddresses();
  }, [user]);

  const handleSelect = (id: string) => {
    const selectedAddress = addresses.find((address) => address.id === id);
    if (selectedAddress) {
      localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
      router.push("/cart"); // Redirect back to the Cart Page
    }
  };

  const handleEdit = (address: Address) => {
    setEditAddress(address);
  };

  const handleSaveEdit = () => {
    if (editAddress) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editAddress.id ? editAddress : a))
      );
      setEditAddress(null);
    }
  };

  return (
    <div className="p-6 bg-babyBlue min-h-screen min-w-[1440]">
      <h1 className="text-heading-lg font-bold mb-6">Change Address</h1>

      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`p-4 bg-white rounded-lg shadow-md ${
              selectedAddressId === address.id ? "border-2 border-textBlue" : ""
            } relative group`}
          >
            <div>
              <p className="text-body-sm font-bold">{address.name}</p>
              <p className="text-body-sm">{address.phone}</p>
              <p className="text-body-sm">{address.address}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleSelect(address.id)}
                className="btn-primary mt-4"
              >
                Select
              </button>
            </div>
            <button
              onClick={() => handleEdit(address)}
              className="absolute top-2 right-2 hidden group-hover:block text-textBlue"
            >
              Edit
            </button>
          </div>
          
        ))}

              <div className="flex py-6 justify-end">
              <Link href="/cart">
                <button className="btn-primary w-30">Back to Cart</button>
              </Link>
            </div>

      </div>

      {/* Edit Modal */}
      {editAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-heading-md font-bold mb-4">Edit Address</h2>
            <input
              type="text"
              value={editAddress.name}
              onChange={(e) =>
                setEditAddress({ ...editAddress, name: e.target.value })
              }
              placeholder="Name"
              className="w-full mb-4 p-2 border rounded"
            />
            <input
              type="text"
              value={editAddress.phone}
              onChange={(e) =>
                setEditAddress({ ...editAddress, phone: e.target.value })
              }
              placeholder="Phone"
              className="w-full mb-4 p-2 border rounded"
            />
            <textarea
              value={editAddress.address}
              onChange={(e) =>
                setEditAddress({ ...editAddress, address: e.target.value })
              }
              placeholder="Address"
              className="w-full mb-4 p-2 border rounded"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEditAddress(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="btn-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeAddress;
