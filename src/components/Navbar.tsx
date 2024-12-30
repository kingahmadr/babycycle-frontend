import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchInput from "./SearchInput";
import { useAuth } from "@/context/AuthContext";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Check window size on mount
    setMobileView(window.innerWidth > 500);
    // console.log("Initial window width:", window.innerWidth);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 240);
    };

    const handleResize = () => {
      setMobileView(window.innerWidth > 500);
      // console.log("Current window width:", window.innerWidth);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      // console.log('mobile view', mobileView, window.innerWidth);
    };
  }, []);

  return (
    <nav
      className={`bg-white shadow-md w-full transition-all duration-300 ${
        isScrolled && mobileView ? "min-h-[235px]" : "min-h-[80px]"
      } pt-4 pb-2 flex flex-col justify-center fixed top-0 left-0 right-0 z-50`}
    >
      <div className="max-w-[1440px] w-full mx-auto">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled && mobileView ? "mb-10" : "mb-4"
          }`}
        >
          {/* Search Section */}
          <div className="w-1/4 flex items-center relative xs:w-auto">
            <SearchInput />
          </div>

          {/* Center Section - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" aria-label="Home">
              <Image
                src="/assets/logo_main.png"
                alt="Babycycle Logo"
                width={isScrolled && mobileView ? 177 : 120}
                height={isScrolled && mobileView ? 94 : 64}
                className="cursor-pointer transition-all duration-300"
              />
            </Link>
          </div>

          {/* Right Section - User and Cart Icons */}
          <div className="flex space-x-6 items-center">
            {/* User Icon with Dropdown */}
            <div className="relative group">
              <button aria-label="User Options">
                <Image
                  src="/assets/login.png"
                  alt="Login Icon"
                  width={50}
                  height={50}
                  className="cursor-pointer"
                />
              </button>
              <div className="absolute hidden group-hover:block bg-white -mt-2 shadow-lg">
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
            <Link href="/cart" aria-label="Cart">
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
        <div className="flex justify-center mobile:hidden">
          <div className="flex space-x-8">
            {["Home", "New Arrivals", "Contact"].map((link, index) => (
              <Link
                key={index}
                href={`/${link.toLowerCase().replace(" ", "-")}`}
                className={`text-textBlue uppercase font-bold hover:text-textGray ${
                  isScrolled ? "text-sm" : "text-base"
                } transition-all duration-300`}
              >
                {link}
              </Link>
            ))}
            <div className="relative group">
              <span
                className={`text-textBlue uppercase font-bold cursor-pointer hover:text-textGray ${
                  isScrolled ? "text-sm" : "text-base"
                } transition-all duration-300`}
              >
                Shop by Category
              </span>
              <div className="absolute hidden group-hover:block bg-white">
                {[
                  { name: "All Products", path: "/product" },
                  { name: "Clothing", path: "/product?category=clothing" },
                  { name: "Furniture", path: "/category/furniture" },
                  { name: "Toys", path: "/category/toys" },
                ].map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    className="block px-4 py-2 uppercase hover:bg-textBlue hover:text-white"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

