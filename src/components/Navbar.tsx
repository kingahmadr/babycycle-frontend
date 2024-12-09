import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <nav className="bg-white px-8 shadow-md">
      <div className="flex items-center justify-between relative">
        
        {/* Left Section - Search Bar */}
<div className="w-1/4 flex items-center relative">
  {isSearchActive ? (
    <div className="relative flex items-center w-full">
      <input
        type="text"
        placeholder="Search products..."
        className="border border-textBlue px-4 py-2 rounded-lg text-textGray focus:outline-none w-full"
        onBlur={() => setIsSearchActive(false)} // Collapse the search bar when it loses focus
      />
      <button
        onClick={() => setIsSearchActive(true)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
      >
        <Image
          src="/assets/search.png"
          alt="Search Icon"
          width={50}
          height={50}
          className="cursor-pointer"
        />
      </button>
    </div>
  ) : (
    <button onClick={() => setIsSearchActive(true)}>
      <Image
        src="/assets/search.png"
        alt="Search Icon"
        width={50}
        height={50}
        className="cursor-pointer"
      />
    </button>
  )}
</div>


        {/* Center Section - Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/">
            <Image
              src="/assets/logo_main.png"
              alt="Babycycle Logo"
              width={177}
              height={94}
              className="cursor-pointer"
            />
          </Link>
        </div>

        {/* Right Section - User and Cart Icons */}
        <div className="flex space-x-6 items-top">
          {/* User Icon with Dropdown */}
          <div className="relative group">
            <button>
              <Image
                src="/assets/login.png"
                alt="Login Icon"
                width={50}
                height={50}
                className="cursor-pointer"
              />
            </button>
            <div className="absolute hidden group-hover:block bg-white mt-(-2) shadow-lg rounded-lg">
              <Link href="/login" className="block px-4 py-2 hover:bg-babyBlue">
                Login
              </Link>
              <Link href="/register" className="block px-4 py-2 hover:bg-babyBlue">
                Register
              </Link>
            </div>
          </div>

          {/* Cart Icon */}
          <Link href="/cart">
            <Image
              src="/assets/cart.png"
              alt="Cart Icon"
              width={50}
              height={50}
              className="cursor-pointer"
            />
          </Link>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex justify-center">
        <div className="flex space-x-8">
          <Link href="/" className="text-textBlue uppercase font-bold hover:text-textGray">
            Home
          </Link>
          <Link href="/new-arrivals" className="text-textBlue uppercase font-bold hover:text-textGray">
            New Arrivals
          </Link>
          <div className="relative group">
            <span className="text-textBlue uppercase font-bold cursor-pointer hover:text-textGray">
              Shop by Category
            </span>
            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg">
            <Link href="/listing" className="block px-4 py-2 hover:bg-babyBlue">
                All Products
              </Link>
              <Link href="/category/clothing" className="block px-4 py-2 hover:bg-babyBlue">
                Clothing
              </Link>
              <Link href="/category/furniture" className="block px-4 py-2 hover:bg-babyBlue">
                Furniture
              </Link>
              <Link href="/category/stroller" className="block px-4 py-2 hover:bg-babyBlue">
                Stroller & Carrier
              </Link>
              <Link href="/category/toys" className="block px-4 py-2 hover:bg-babyBlue">
                Toys
              </Link>
            </div>
          </div>
          <Link href="/contact" className="text-textBlue uppercase font-bold hover:text-textGray">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
