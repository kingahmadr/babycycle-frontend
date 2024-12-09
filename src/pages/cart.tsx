import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  cartItems: CartItem[];
}

const CartPage: React.FC<CartProps> = ({ cartItems: initialCartItems }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedCardType, setSelectedCardType] = useState<string | null>(null);

  // Load selected address from localStorage or fallback to default
  useEffect(() => {
    const savedAddress = JSON.parse(
      localStorage.getItem("selectedAddress") ||
        JSON.stringify({
          id: "1",
          name: "Samuel Indra W.",
          phone: "08567425627",
          address:
            "Gang Masjid Jami Al Huda, Lewinutug, Kec. Citeureup, Kabupaten Bogor, Jawa Barat",
        })
    );
    setSelectedAddress(savedAddress);
  }, []);

  const increaseQuantity = (id: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal * 0.1; // 10% of subtotal
  const total = subtotal + shipping;

  const handleCheckout = () => {
    console.log("Transaction Data:", {
      subtotal,
      shipping,
      total,
      items: cartItems,
      address: selectedAddress,
    });
  };

  return (
    <div className="bg-babyBlue min-h-screen flex flex-col">
      <main className="flex-1 flex p-20 space-x-20">
        {/* Left Section */}
        <div className="flex-1 space-y-6">
          {/* Address Section */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            {selectedAddress ? (
              <div>
                <p className="text-body-sm font-bold">{selectedAddress.name}</p>
                <p className="text-body-sm">{selectedAddress.phone}</p>
                <p className="text-body-sm">{selectedAddress.address}</p>
              </div>
            ) : (
              <p className="text-body-sm font-bold">No address selected</p>
            )}
            <div className="flex justify-end">
              <Link href="/ChangeAddress">
                <button className="btn-primary mt-4">Change Address</button>
              </Link>
            </div>
          </div>

          {/* Product List */}
          <div className="flex flex-col justify-between">
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between gap-x-8"
                >
                  {/* Product Image and Details */}
                  <div className="flex flex-1 items-center gap-x-4">
                    <Image
                      src="/assets/placeholder.png" // Placeholder image
                      alt="Product Image"
                      width={80}
                      height={80}
                      className="rounded-lg"
                    />
                    <div>
                      <h2 className="text-body-sm font-bold">{item.name}</h2>
                      <p className="text-body-sm">
                        Rp {item.price.toLocaleString()} / unit
                      </p>
                    </div>
                  </div>

                  {/* Qty Handler */}
                  <div className="flex flex-row items-center text-body-sm space-x-1">
                    <span>{item.quantity}</span>
                    <div className="flex flex-col items-center space-y-1">
                      <button onClick={() => increaseQuantity(item.id)}>
                        <Image
                          src="/assets/increase.png"
                          alt="Increase"
                          width={24}
                          height={24}
                        />
                      </button>

                      <button onClick={() => decreaseQuantity(item.id)}>
                        <Image
                          src="/assets/decrease.png"
                          alt="Decrease"
                          width={24}
                          height={24}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="flex-1 text-body-sm font-bold text-center">
                    Rp {(item.price * item.quantity).toLocaleString()}
                  </div>

                  {/* Remove Icon */}
                  <div className="flex justify-end">
                    <button onClick={() => removeItem(item.id)}>
                      <Image
                        src="/assets/remove.png"
                        alt="Remove"
                        width={24}
                        height={24}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex py-6 justify-end">
              <button className="btn-primary w-30 justify-end">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>

        {/* Right Section (Payment Details) */}
        <div className="w-1/3 bg-paymentPurple p-6 rounded-lg shadow-md">
          <h3 className="text-heading-md text-white mb-4">Card Details</h3>
          <div className="space-y-4">
            <div className="flex space-x-4">
              {["mastercard", "visa", "rupay"].map((type) => (
                <div
                  key={type}
                  onClick={() => setSelectedCardType(type)}
                  className={`cursor-pointer p-2 rounded-md ${
                    selectedCardType === type ? "border-2 border-white" : ""
                  }`}
                >
                  <Image
                    src={`/assets/${type}.png`}
                    alt={type}
                    width={75}
                    height={55}
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="text-white">Name on card</label>
              <input type="text" placeholder="Name" className="input w-full" />
            </div>
            <div>
              <label className="text-white">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 90XX XXXX"
                className="input w-full"
              />
            </div>
            <div className="flex space-x-4">
              <div>
                <label className="text-white">Expiration Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="text-white">CVV</label>
                <input type="text" placeholder="123" className="input w-full" />
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-white">Subtotal</span>
              <span className="text-white">
                IDR {subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">Shipping</span>
              <span className="text-white">
                IDR {shipping.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-white">Total (Tax. incl)</span>
              <span className="text-white">{total.toLocaleString()}</span>
            </div>
          </div>
          <button
            className="btn-primary w-full mt-4 bg-labelGreen"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </main>
    </div>
  );
};

export default CartPage;

// Fetch cart data using SSR
export const getServerSideProps: GetServerSideProps = async () => {
  const cartItems = [
    { id: "1", name: "Product Name 1", price: 999999, quantity: 1 },
    { id: "2", name: "Product Name 2", price: 999999, quantity: 1 },
    { id: "3", name: "Product Name 3", price: 999999, quantity: 1 },
  ];

  return {
    props: {
      cartItems,
    },
  };
};
