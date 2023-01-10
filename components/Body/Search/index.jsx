import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const SearchBar = () => {
  const searchRef = useRef();
  useEffect(() => {
    searchRef.current.value = "";
  }, []);
  const handleChange = (e) => {
    e.preventDefault();
    searchRef.current.value = e.target.value;
  };
  const router = useRouter();
  const handleSearch = async () => {
    if (searchRef.current.value === "" || !searchRef.current.value) {
      return toast.error("Vui lòng nhập từ khóa tìm kiếm");
    }
    searchRef.current.blur();
    await router.push(`/search/${searchRef.current.value}`);
  };

  return (
    <label
      htmlFor="search"
      className="flex items-center shadow-md z-10 rounded-md mb-4"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      }}
    >
      <input
        type="text"
        id="search"
        className="rounded-md border border-r-0 focus:outline-[#ff7a00] rounded-tr-none rounded-br-none p-2 w-full"
        placeholder="Nhà hàng âu, beefsteak,..."
        ref={searchRef}
        onChange={handleChange}
      />
      <button
        className="px-4 border border-[#ff7a00] text-white border-l-0 bg-[#ff7a00] rounded-md py-2 rounded-tl-none rounded-bl-none sm:hover:opacity-70 transition-opacity"
        onClick={handleSearch}
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </label>
  );
};

export default SearchBar;
