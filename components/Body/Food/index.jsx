import { toDot } from "lib/todot";
import Link from "next/link";
import React from "react";

const FoodCard = ({ MaMonAn, TenMonAn, Gia, MaCuaHang, ImgUrl }) => {
  return (
    <>
      <Link href={`/food/${MaMonAn}`} className="md:w-[20%] sm:w-52 w-full p-2">
        <div className="rounded-md relative bg-white shadow-md sm:hover:shadow-lg sm:hover:scale-[1.005] transition-transform cursor-pointer">
          <div className="relative">
            <img
              src={ImgUrl}
              alt={TenMonAn}
              className="sm:object-cover object-contain object-center rounded-md w-full h-60 rounded-b-none"
            />
            <span className="bg-[#ff7a00] opacity-80 text-white rounded absolute top-0 right-0 px-1">
              {MaCuaHang}
            </span>
          </div>
          <div className="p-2">
            <p className="font-semibold text-xl opacity-80 whitespace-nowrap overflow-hidden text-ellipsis">
              {TenMonAn}
            </p>
            <p className="text-[#ff7a00] font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
              {toDot(Gia)}
              <span className="text-sm">VND</span>
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default FoodCard;
