import { API_CARTS } from "@/constants/apis";
import { enqueueSnackbar } from "notistack";
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
  product_id: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
  total_price: number;
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void; // Added clearCart to the context
}

export const CartContext = createContext<CartContextProps | undefined>(
  undefined
);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(API_CARTS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setCart(Array.isArray(data) ? data : []);
      console.log(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]); // Fallback to an empty array in case of error
    }
  }
  
  // Add a new item to the cart or update its quantity
  // const addToCart = (item: CartItem) => {
  //   setCart((prevCart) => {
  //     const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
  //     if (existingItem) {
  //       return prevCart.map((cartItem) =>
  //         cartItem.id === item.id
  //           ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
  //           : cartItem
  //       );
  //     }
  //     return [...prevCart, item];
  //   });

  // };
  const addToCart = (item: CartItem) => {
    setCart((prevCart = []) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
  
      if (existingItem) {
        // Update the quantity of the existing item
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
  
      // Add the new item to the cart
      return [...prevCart, item];
    });
  };

  const removeFromCart = async (id: string) => {
    try {
      // Send DELETE request to the backend
      const response = await fetch(`${API_CARTS}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if required
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error removing item from cart:", errorData);
        enqueueSnackbar(errorData.message || "Failed to remove item from cart.", {
          variant: "error",
        });
        return;
      }
  
      // Remove the item from the frontend state
      setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== id));
  
      enqueueSnackbar("Item removed from cart successfully!", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      // enqueueSnackbar("An error occurred while removing the item from the cart.", {
      //   variant: "error",
      // });
    }
  };

  const increaseQuantity = async (id: string) => {
 
    setCart((prevCart) => {
      let updatedItem: any;
        const newCart = prevCart.map((cartItem) => {
          if (cartItem.id === id) {
            updatedItem = { ...cartItem, quantity: cartItem.quantity + 1,
             total_price: cartItem.price * (cartItem.quantity + 1),
             };
            return updatedItem;
          }
          return cartItem;
        });
    
        return newCart;
      });

    const cartFromStorage = localStorage.getItem("cart");
    if (!cartFromStorage) {
      console.error("No cart found in localStorage");
      return;
    }

    // Parse the cart data
    const cart = JSON.parse(cartFromStorage);

    // Update the item quantity
    const updatedCart = cart.map((cartItem: any) => {
      if (cartItem.id === id) {
        return { ...cartItem, quantity: cartItem.quantity + 1,
         total_price: cartItem.price * (cartItem.quantity + 1),
         };
      }
      return cartItem;
    });
   
    let updatedItem = updatedCart.find((item: any) => item.id === id);
    if (!updatedItem) {
      console.error(`Cart item with ID ${id} not found`);
      return;
    }
    
     // Save the updated cart back to localStorage
     localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Send the updated item to the backend
    try {
      const response = await fetch(`${API_CARTS}/${updatedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedItem), // Send the updated cart item
      });
  
      const data = await response.json();
      console.log(`Item ${updatedItem.id} updated:`, data);
  
      if (!response.ok) {
        throw new Error(
          data.message || `Failed to update item with ID ${updatedItem.id}`
        );
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };
  
  const decreaseQuantity = async (id: string) => {
    // Update the cart state and ensure quantity is not less than 0
    setCart((prevCart) => {
      const newCart = prevCart.map((cartItem) => {
        if (cartItem.id === id) {
          const newQuantity = Math.max(cartItem.quantity - 1, 1); // Ensure quantity >= 0
          return {
            ...cartItem,
            quantity: newQuantity,
            total_price: cartItem.price * newQuantity, // Update total_price
          };
        }
        return cartItem;
      });
  
      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(newCart));
  
      return newCart;
    });
  
    const cartFromStorage = localStorage.getItem("cart");
    if (!cartFromStorage) {
      console.error("No cart found in localStorage");
      return;
    }
  
    // Parse the cart data
    const cart = JSON.parse(cartFromStorage);
  
    // Update the item quantity in localStorage
    const updatedCart = cart.map((cartItem: any) => {
      if (cartItem.id === id) {
        const newQuantity = Math.max(cartItem.quantity - 1, 1); // Ensure quantity >= 0
        return {
          ...cartItem,
          quantity: newQuantity,
          total_price: cartItem.price * newQuantity, // Update total_price
        };
      }
      return cartItem;
    });
  
    // Find the updated item
    const updatedItem = updatedCart.find((item: any) => item.id === id);
    if (!updatedItem) {
      console.error(`Cart item with ID ${id} not found`);
      return;
    }
  
    // Save the updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  
    // Send the updated item to the backend
    try {
      const response = await fetch(`${API_CARTS}/${updatedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedItem), // Send the updated cart item
      });
  
      const data = await response.json();
      console.log(`Item ${updatedItem.id} updated:`, data);
  
      if (!response.ok) {
        throw new Error(
          data.message || `Failed to update item with ID ${updatedItem.id}`
        );
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  // Clear the cart and remove it from localStorage
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart, // Exposed clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
