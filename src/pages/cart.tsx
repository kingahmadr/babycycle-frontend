import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CartContext } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { API_CHECKOUT, API_CHECKOUT_VALIDATION, API_CHECKOUT_ITEM, API_CARTS_CLEAR } from "@/constants/apis";
import { formattedDate } from "@/utils/getCheckoutTimestamp";
import { AddressModel } from "@/models/Address";
import { useSnackbar } from "notistack";

const CartPage: React.FC = () => {
  const cartContext = useContext(CartContext);
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

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

  let subtotal = 0;
  let shipping = 0;
  let total = 0;
  
  if (cart && cart.length > 0) {
    subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    shipping = subtotal * 0.1; // Calculate 10% of subtotal as shipping
    total = subtotal + shipping;
  }

  // const [dataTemp, setDataTemp] = useState<any[]>([]);

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
    console.log('cart', cart)
    
    try {

      setLoading(true);
      const response = await fetch(API_CHECKOUT_VALIDATION, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        
      });
  
      const data = await response.json();
      if (!response.ok) {
        console.log("Validation Error:", data);
  
        // Combine error and product_name into a single message
        const errorMessage = `${data.error || "Error occurred"} - ${
          data.product_name || "Unknown product"
        }`;
  
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });
        // setLoading(false);
        return;
      }
      console.log('response', data);

      if (paymentMethod === "bank_transfer" && !bankTransferConfirmed) {
        enqueueSnackbar("Please confirm that you've transferred successfully.", {
          variant: "error",
        });
        return;
      }
  
      if (paymentMethod === "e_wallet" && (!eWalletDetails.phone || !eWalletDetails.email)) {
        enqueueSnackbar("Please fill in the details of your eWallet for payment deduction.", {
          variant: "error",
        });
        return;
      }
  
      const checkoutId = `CHK-${formattedDate}`;
      const cartData = cart.map((item) => ({
        product_id: parseInt(item.product_id, 10),
        quantity: item.quantity,
        total_price: item.price * item.quantity,
        user_address: selectedAddress?.address || "Unknown address",
        checkout_order_id: checkoutId,
      }));

      console.log('cartData', cartData)

      const checkoutPayload = {
        checkout_id: checkoutId,
        payment_method: paymentMethod,
      };

      const checkoutResponse = await fetch(API_CHECKOUT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(checkoutPayload),
      });


      if (!checkoutResponse.ok) {
        enqueueSnackbar("Failed to process checkout. Please try again.", {
          variant: "error",
        });
        return;
      }

      const checkoutItemsResponse = await fetch(API_CHECKOUT_ITEM, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(cartData),
      });
      
      const responseData = await checkoutItemsResponse.json(); // Parse response JSON
      
      if (!checkoutItemsResponse.ok) {
        // Display backend error message if available, or a fallback message
        const errorMessage =
          responseData ;
        enqueueSnackbar(errorMessage, { variant: "error" });
        return;
      }
      
      // Display success message from backend or fallback
      const successMessage =
        responseData?.message || "Checkout items processed successfully!";
      enqueueSnackbar(successMessage, { variant: "success" });

      const clearCartResponse = await fetch(API_CARTS_CLEAR, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!clearCartResponse.ok) {
        enqueueSnackbar("Failed to clear cart. Please try again.", {
          variant: "error",
        });
        return;
      }
      enqueueSnackbar("Cart cleared successfully!", {
        variant: "success",
      })
      window.location.href = "/cart";

    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
      
    
  }

  return (
    <div className="bg-babyBlue min-h-screen w-full flex flex-col">
      <main className="flex-1 flex flex-col lg:flex-row p-4 lg:p-20 space-y-8 lg:space-y-0 lg:space-x-20">
        {/* Left Section */}
        <div className="flex-1 space-y-6">
          {/* Address Section */}
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md flex flex-col justify-between">
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
             <div className="space-y-4">
                {Array.isArray(cart) && cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    {/* Product Image and Details */}
                    <div className="flex items-center gap-x-4 w-full sm:w-1/2">
                      <Link href={`/product/${item.product_id}`} passHref>
                        <Image
                          src="/assets/placeholder_image.jpg"
                          alt="Product Image"
                          width={80}
                          height={80}
                          className="rounded-lg cursor-pointer"
                        />
                      </Link>
                      <div>
                        <Link href={`/product/${item.product_id}`} passHref>
                          <h2 className="text-body-sm font-bold hover:text-textBlue hover:underline">
                            {item.name}
                          </h2>
                        </Link>
                        <p className="text-body-sm">
                          Rp {item?.price ? item.price.toLocaleString() : "0"} / unit
                        </p>
                      </div>
                    </div>

                    {/* Qty Handler */}
                    <div className="flex flex-row items-center space-x-2">
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
                    <div className="text-body-sm font-bold text-center w-full sm:w-1/4">
                      Rp {(item.price * item.quantity).toLocaleString()}
                    </div>

                    {/* Remove Icon */}
                    <button onClick={() => removeFromCart(item.id)}>
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
            <div className="flex py-6 justify-end">
              <Link href="/product">
                <button className="btn-primary w-full md:w-30">Continue Shopping</button>
              </Link>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="w-full lg:w-1/3 bg-paymentPurple p-4 lg:p-6 rounded-lg shadow-md">
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
                  onChange={(e) =>
                    setEWalletDetails({ ...eWalletDetails, phone: e.target.value })
                  }
                  className="w-full p-2 mb-2"
                />
              </div>
              <div>
                <label className="text-white">E-Wallet Email</label>
                <input
                  type="email"
                  placeholder="Input your e-wallet email"
                  value={eWalletDetails.email}
                  onChange={(e) =>
                    setEWalletDetails({ ...eWalletDetails, email: e.target.value })
                  }
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

          <button
            className="btn-primary w-full mt-6"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Processing..." : "Checkout"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default CartPage;

