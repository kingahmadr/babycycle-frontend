import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
}

const ChangeAddress: React.FC = () => {
  const router = useRouter();

  const placeholderAddresses: Address[] = [
    {
      id: "1",
      name: "Samuel Indra W.",
      phone: "08567425627",
      address:
        "Gang Masjid Jami Al Huda, Lewinutug, Kec. Citeureup, Kabupaten Bogor, Jawa Barat",
    },
    {
      id: "2",
      name: "Maria Mercedez",
      phone: "08534326787",
      address:
        "Balai Diklat Industri Denpasar, Jalan WR. Supratman, Kec. Denpasar Tim., Kota Denpasar, Bali",
    },
  ];

  const [addresses, setAddresses] = useState<Address[]>(placeholderAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("1");

  const handleSelect = (id: string) => {
    setSelectedAddressId(id);
    const selectedAddress = addresses.find((address) => address.id === id);
    if (selectedAddress) {
      localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
      router.push("/cart");
    }
  };

  const handleAddNewAddress = () => {
    console.log("Add New Address functionality");
  };

  return (
    <div className="p-6 bg-babyBlue min-h-screen">
      <h1 className="text-heading-lg font-bold mb-6">Change Address</h1>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleAddNewAddress}
          className="btn-secondary px-6 py-2 rounded-lg"
        >
          Add New Address +
        </button>
      </div>
      
      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`p-4 bg-white rounded-lg shadow-md ${
              selectedAddressId === address.id ? "border-2 border-textBlue" : ""
            }`}
          >
            <p className="text-body-sm font-bold">{address.name}</p>
            <p className="text-body-sm">{address.phone}</p>
            <p className="text-body-sm">{address.address}</p>
            <div className="flex justify-end">
              <button
                onClick={() => handleSelect(address.id)}
                className="btn-primary mt-4"
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default ChangeAddress;
