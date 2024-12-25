import React, { useState, useEffect } from "react";
import Image from "next/image";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";
import { API_SEARCH } from "@/constants/apis";
import { DataWithCount } from "@/models/DataWithCount";
import { SearchModel } from "@/models/Searchs";


const SearchInput = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [query, setQuery] = useState("");
  const [fetchedData, setFetchedData] = useState<DataWithCount<SearchModel> | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        fetchData(query);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);
  const fetchData = async (searchQuery: string) => {
    setFetchedData({ total_count: 0, data: [] });
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_SEARCH}?query=${searchQuery}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setFetchedData(data.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClick = (url: string) => {
    router.push(url);
    setIsSearchActive(false);
  };

  return (
    <div className="relative flex items-center">
      {/* Search Icon */}
      <button onClick={() => setIsSearchActive(true)}>
        <Image
          src="/assets/search.png"
          alt="Search Icon"
          width={50}
          height={50}
          className="cursor-pointer"
        />
      </button>

      {/* Expanding Search Input */}
      <div
        className={`absolute left-full ml-2 flex items-center transition-all duration-300 ${
          isSearchActive ? "w-[200px] opacity-100" : "w-0 opacity-0"
        } overflow-hidden`}
      >
        <input
          type="text"
          placeholder="Search products..."
          className={`border border-textBlue px-4 py-2 rounded-lg text-textGray ${
            isSearchActive && "focus:border-3 focus:outline-none"
          } w-full z-20`}
          onChange={handleChange}
          autoFocus={isSearchActive}
        />
      </div>

      {/* Overlay */}
      {isSearchActive && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10"
          onClick={() => setIsSearchActive(false)}
        ></div>
      )}

      {/* Results Dropdown */}
      {isSearchActive && query && (
        <div className="absolute top-full left-[60px] w-[195px] bg-white shadow-lg z-20 max-h-[300px] overflow-auto">
          {loading && (
            <div className="flex justify-center p-2 h-auto">
              <Spinner />
            </div>
          )}

          {error ? (
            <div className="text-red-500">Error fetching data.</div>
          ) : Array.isArray(fetchedData) && fetchedData.length > 0 ? (
            fetchedData.map((product) => (
              <button
                key={product.id}
                className="hover:bg-textBlue p-2 w-full text-left transition-all duration-150"
                onClick={() => handleClick(`/product/${product.id}`)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleClick(`/product/${product.id}`)
                }
                tabIndex={0}
              >
                {product.name}
              </button>
            ))
          ) : (
            <div className="p-2">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
