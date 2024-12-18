import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CartContext } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { API_CHECKOUT, API_CARTS, API_CHECKOUT_ITEM } from "@/constants/apis";
import { formattedDate } from "@/utils/getCheckoutTimestamp";
import { AddressModel } from "@/models/Address";

const CartPage: React.FC = () => {
  const cartContext = useContext(CartContext);
  const { user } = useAuth();

  if (!cartContext) {
    throw new Error("CartContext is not available. Ensure CartProvider wraps the component.");
  }

  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartContext;

  const [selectedAddress, setSelectedAddress] = useState<AddressModel>();
  const [selectedCardType, setSelectedCardType] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [loading, setLoading] = useState(false);
  const [bankTransferConfirmed, setBankTransferConfirmed] = useState(false);
  const [eWalletDetails, setEWalletDetails] = useState({ phone: "", email: "" });
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal * 0.1;
  const total = subtotal + shipping;

  useEffect(() => {
    const addressFromStorage = JSON.parse(localStorage.getItem("selectedAddress") || "{}");
    if (addressFromStorage?.address) {
      setSelectedAddress(addressFromStorage);
    } else if (user?.address) {
      setSelectedAddress({
        name: user.username || "Guest",
        phone: user.phone || "No phone number available",
        address: user.address || "No address available",
      });
    } else {
      setSelectedAddress({
        name: "Guest",
        phone: "No phone number available",
        address: "No address available",
      });
    }
  }, [user]);

  const handleCheckout = async () => {
    // if (!user) {
    //   alert("You must be logged in to checkout.");
    //   return;
    // }

    if (paymentMethod === "bank_transfer" && !bankTransferConfirmed) {
      alert("Please confirm that you have transferred successfully.");
      return;
    }

    if (paymentMethod === "e_wallet" && (!eWalletDetails.phone || !eWalletDetails.email)) {
      alert("Please fill in the E-Wallet phone number and email address.");
      return;
    }

    const checkoutId = `CHK-${formattedDate}`;

    const cartData = cart.map((item) => ({
      product_id: parseInt(item.id, 10),
      quantity: item.quantity,
      total_price: item.price * item.quantity,
      user_address: selectedAddress?.address || "Unknown address",
      checkout_order_id: checkoutId,
      // user_id: 22,
    }));
    console.log("Cart Data:", cartData);
    try {
      setLoading(true);

      // Submit Cart Data
      const cartResponse = await fetch(API_CARTS, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cartData),
      });
      if (!cartResponse.ok) throw new Error("Failed to submit cart data.");
    
      // Submit Checkout Data
      const checkoutPayload = {
        checkout_id: checkoutId,
        // user_id: 22,
        // total_price: total,
        payment_method: paymentMethod,
        // ...(paymentMethod === "e_wallet" && eWalletDetails),
      };
      
      console.log("Checkout Payload:", checkoutPayload);

      const checkoutResponse = await fetch(API_CHECKOUT, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(checkoutPayload),
      });


      if (!checkoutResponse.ok) {
        const responseJson = await checkoutResponse.json()
        throw new Error(responseJson.msg);
      }

      const responseCheckout= await checkoutResponse.json()
      console.log("Checkout Response:", responseCheckout.message);

      
      // Submit Checkout Data
      const checkoutItems = await fetch(API_CHECKOUT_ITEM, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cartData),
      });
      if (!checkoutItems.ok) {
        const responseJson = await checkoutItems.json()
        throw new Error(responseJson.msg);
      }
      const responseCheckoutItems= await checkoutItems.json()
      console.log("Checkout Items:", responseCheckoutItems);
      
      alert("Checkout Successful!");
      clearCart();
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Failed to process checkout. Please try again later.");
    } finally {
      setLoading(false);
    }

  };


  return (
    <div className="bg-babyBlue min-h-screen w-full flex flex-col">
      <main className="flex-1 flex p-20 space-x-20">
       
        {/* Left Section */}
        <div className="flex-1 space-y-6">

          {/* Address Section */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <p className="text-body-sm font-bold">{selectedAddress?.name}</p>
              <p className="text-body-sm">{selectedAddress?.phone}</p>
              <p className="text-body-sm">{selectedAddress?.address}</p>
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

   {/* Payment Details */}
   <div className="w-1/3 bg-paymentPurple p-6 rounded-lg shadow-md">
<h3 className="text-white mb-4">Payment Method</h3>
<select
  value={paymentMethod}
  onChange={(e) => setPaymentMethod(e.target.value)}
  className="w-full p-2 mb-4"
>
  <option value="credit_card">Credit Card</option>
  <option value="bank_transfer">Bank Transfer</option>
  <option value="e_wallet">E-Wallet</option>
</select>



{paymentMethod === "credit_card" && (
  <>
    <div className="flex space-x-4">
      {["mastercard", "visa", "rupay"].map((type) => (
        <div
          key={type}
          onClick={() => setSelectedCardType(type)}
          className={`p-2 rounded-md ${
            selectedCardType === type ? "border-2 border-white" : ""
          } cursor-pointer`}
        >
          <Image src={`/assets/${type}.png`} alt={type} width={75} height={55} />
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

  </>
)}

{paymentMethod === "bank_transfer" && (
  <div>
    <p className="text-white">Transfer to: Bank BCA, 1234567890, PT BabyCycle</p>
    <label className="flex items-center mt-4 text-white">
      <input
        type="checkbox"
        checked={bankTransferConfirmed}
        onChange={(e) => setBankTransferConfirmed(e.target.checked)}
      />
      <span className="ml-2">I have transferred successfully</span>
    </label>
  </div>
)}

{paymentMethod === "e_wallet" && (
  <>
  <div>
<label className="text-white">E-wallet Phone Number</label>
    <input
      type="text"
      placeholder="Input your phone number e.g. 08123XXXXXX"
      value={eWalletDetails.phone}
      onChange={(e) => setEWalletDetails({ ...eWalletDetails, phone: e.target.value })}
      className="w-full p-2 mb-2"
    />
    </div>

<div>
<label className="text-white">E-Wallet Email</label>
    <input
      type="email"
      placeholder="Input your e-wallet email"
      value={eWalletDetails.email}
      onChange={(e) => setEWalletDetails({ ...eWalletDetails, email: e.target.value })}
      className="w-full p-2"
    />
    </div>
  </>
)}

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

<button className="btn-primary w-full mt-6" onClick={handleCheckout} disabled={loading}>
  {loading ? "Processing..." : "Checkout"}
  </button>
</div>
</main>
</div>
);
};

export default CartPage;


