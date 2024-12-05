import { GetServerSideProps } from "next";
import { useState } from "react";
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
  const [selectedCardType, setSelectedCardType] = useState<string | null>(null);

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
          ? { ...item, quantity: item.quantity - 1 } : item
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
      address: "Samuel Indra W., Gang Masjid Jami Al Huda, Jawa Barat",
    });
  };

  return (
    <div className="bg-babyBlue min-h-screen flex flex-col">
      <header className="mb-6">
        {/* Add Navbar */}
      </header>

      <main className="flex-1 flex p-6 space-x-6">
        {/* Left Section */}
        <div className="flex-1 space-y-6">
          {/* Address Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-body-sm font-bold">Samuel Indra W.</p>
            <p className="text-body-sm">08567425627</p>
            <p className="text-body-sm">
              Gang Masjid Jami Al Huda, Lewinutug, Kec. Citeureup, Kabupaten Bogor,
              Jawa Barat
            </p>
            <button className="btn-primary mt-4 w-fit">Change Address</button>
          </div>

          <div className="border-t-2 border-white my-4"></div>

          {/* Product List */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
              >
                <Image
                  src="/assets/placeholder.png" // Placeholder image
                  alt="Product Image"
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div className="flex-1 ml-4">
                  <h2 className="text-body-sm font-bold">{item.name}</h2>
                  <p className="text-body-sm">Rp {item.price.toLocaleString()} / unit</p>
                </div>

                {/* Qty Handler */}
                <div className="flex items-center space-x-2">
                      <span>{item.quantity}</span>
                      <div className="flex flex-col items-center space-y-1">
                        <button onClick={() => increaseQuantity(item.id)}>
                          <Image src="/assets/increase.png" alt="Increase" width={24} height={24} />
                        </button>
                        <button onClick={() => decreaseQuantity(item.id)}>
                          <Image src="/assets/decrease.png" alt="Decrease" width={24} height={24} />
                        </button>
                      </div>
                </div>

                {/* Total Price */}
                <div className="text-body-sm font-bold text-center mx-4">
                  Rp {(item.price * item.quantity).toLocaleString()}
                </div>

                {/* Remove Icon */}
                <button onClick={() => removeItem(item.id)} className="ml-auto">
                  <Image
                    src="/assets/remove.png"
                    alt="Remove"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            ))}
          </div>

          <button className="btn-primary w-full">Continue Shopping</button>
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
              <span className="text-white">IDR {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">Shipping</span>
              <span className="text-white">IDR {shipping.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-white">Total (Tax. incl)</span>
              <span className="text-white">IDR {total.toLocaleString()}</span>
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
