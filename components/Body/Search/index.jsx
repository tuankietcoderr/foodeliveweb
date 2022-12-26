import React from "react";

const SearchBar = () => {
  return (
    <label
      htmlFor="search"
      className="flex items-center shadow-md z-10 rounded-md"
    >
      <input
        type="text"
        id="search"
        className="rounded-md border border-r-0 focus:outline-[#ff7a00] rounded-tr-none rounded-br-none p-2 w-full"
        placeholder="Nhà hàng âu, nhà hàng nhật bản,..."
      />
      <button className="w-40 border border-[#ff7a00] text-white border-l-0 bg-[#ff7a00] rounded-md py-2 rounded-tl-none rounded-bl-none sm:hover:opacity-70 transition-opacity">
        Tìm kiếm
      </button>
    </label>
  );
};

export default SearchBar;
