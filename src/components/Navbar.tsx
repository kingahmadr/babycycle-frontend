import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchInput from "./SearchInput";
import { useAuth } from "@/context/AuthContext";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 240;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`bg-white shadow-md w-full transition-all duration-300 ${
        isScrolled ? "min-h-[80px]" : "min-h-[235px]"
      } pt-4 pb-2 flex flex-col justify-center fixed top-0 left-0 right-0 z-50`}
    >
      <div className="max-w-[1440px] w-full mx-auto">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "mb-4" : "mb-20"
          }`}
        >
          {/* Search Section */}
          <div className="w-1/4 flex items-center relative">
            <SearchInput />
          </div>

          {/* Center Section - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/">
              <Image
                src="/assets/logo_main.png"
                alt="Babycycle Logo"
                width={isScrolled ? 120 : 177}
                height={isScrolled ? 64 : 94}
                className="cursor-pointer transition-all duration-300"
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
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 hover:bg-babyBlue"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="text-left w-full block px-4 py-2 hover:bg-babyBlue"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-2 uppercase hover:bg-textBlue hover:text-white"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-2 uppercase hover:bg-textBlue hover:text-white"
                    >
                      Register
                    </Link>
                  </>
                )}
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
            <Link
              href="/"
              className={`text-textBlue uppercase font-bold hover:text-textGray ${
                isScrolled ? "text-sm" : "text-base"
              } transition-all duration-300`}
            >
              Home
            </Link>
            <Link
              href="/new-arrivals"
              className={`text-textBlue uppercase font-bold hover:text-textGray ${
                isScrolled ? "text-sm" : "text-base"
              } transition-all duration-300`}
            >
              New Arrivals
            </Link>
            <div className="relative group">
              <span
                className={`text-textBlue uppercase font-bold cursor-pointer hover:text-textGray ${
                  isScrolled ? "text-sm" : "text-base"
                } transition-all duration-300`}
              >
                Shop by Category
              </span>
              <div className="absolute hidden group-hover:block bg-white">
                <Link
                  href="/product"
                  className="block px-4 py-2 uppercase hover:bg-textBlue hover:text-white"
                >
                  All Products
                </Link>
                <Link
                  href="/category/clothing"
                  className="block px-4 py-2 uppercase hover:bg-textBlue hover:text-white"
                >
                  Clothing
                </Link>
                <Link
                  href="/category/furniture"
                  className="block px-4 py-2 uppercase hover:bg-textBlue hover:text-white"
                >
                  Furniture
                </Link>
                <Link
                  href="/category/stroller"
                  className="block px-4 py-2 uppercase hover:bg-textBlue hover:text-white"
                >
                  Stroller & Carrier
                </Link>
                <Link
                  href="/category/toys"
                  className="block px-4 py-2 uppercase hover:bg-textBlue hover:text-white"
                >
                  Toys
                </Link>
              </div>
            </div>
            <Link
              href="/contact"
              className={`text-textBlue uppercase font-bold hover:text-textGray ${
                isScrolled ? "text-sm" : "text-base"
              } transition-all duration-300`}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
