import { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CartContext } from "@/context/CartContext";

const CartPage: React.FC = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("CartContext is not available. Ensure CartProvider wraps the component.");
  }

  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = cartContext;

  const [selectedCardType, setSelectedCardType] = useState<string | null>(null);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal * 0.1; // 10% of subtotal
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    const userAddress = "Jalan Contoh"; //Placeholder

    const checkoutData = cart.map((item) => ({
      product_id: parseInt(item.id,10),
      quantity: item.quantity,
      total_price: item.price * item.quantity,
      user_address: userAddress,
      user_id: 22, //Placeholder
    }));

    console.log(checkoutData, cartContext);
    console.log("Checkout Data:", JSON.stringify(checkoutData));    
    
    try {
      const response = await fetch("https://api.babycycle.my.id/api/v1/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit checkout data.");
      }

      alert("Checkout Successful!");

    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Failed to process checkout. Please try again later.");
    }

  };

  return (
    <div className="bg-babyBlue min-h-screen flex flex-col">
      <main className="flex-1 flex p-20 space-x-20">
        {/* Left Section */}
        <div className="flex-1 space-y-6">
          {/* Address Section */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <p className="text-body-sm font-bold">Samuel Indra W.</p>
              <p className="text-body-sm">08567425627</p>
              <p className="text-body-sm">
                Gang Masjid Jami Al Huda, Lewinutug, Kec. Citeureup, Kabupaten Bogor, Jawa Barat
              </p>
            </div>
            <div className="flex justify-end">
              <Link href="/ChangeAddress">
                <button className="btn-primary mt-4">Change Address</button>
              </Link>
            </div>
          </div>

          {/* Product List */}
          <div className="flex flex-col justify-between">
            <div className="flex-1 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between gap-x-8"
                >
                  {/* Product Image and Details */}
                  <div className="flex flex-1 items-center gap-x-4">
                  <Link href={`/product/${item.id}`} passHref>
                      <Image
                        src="/assets/placeholder.png" 
                        alt="Product Image"
                        width={80}
                        height={80}
                        className="rounded-lg cursor-pointer"
                      />
                    </Link>
                    <div>
                      <Link href={`/product/${item.id}`} passHref>
                      <h2 className="text-body-sm font-bold hover:text-textBlue hover:underline">{item.name}</h2>
                      </Link>
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
                    <button onClick={() => removeFromCart(item.id)}>
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
              <Link href="/listing">
                <button className="btn-primary w-30">Continue Shopping</button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section (Payment Details) */}
        <div className="w-1/3 bg-paymentPurple p-6 rounded-lg shadow-md">
          <h3 className="text-heading-md text-white mb-4">Card Details</h3>
          <div className="space-y-4">
            {/* Card Selection */}
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

            {/* Input Fields */}
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
                <input type="text" placeholder="MM/YY" className="input w-full" />
              </div>
              <div>
                <label className="text-white">CVV</label>
                <input type="text" placeholder="123" className="input w-full" />
              </div>
            </div>
          </div>

          {/* Payment Summary */}
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
              <span className="text-white">Total (Tax incl.)</span>
              <span className="text-white">{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout Button */}
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
