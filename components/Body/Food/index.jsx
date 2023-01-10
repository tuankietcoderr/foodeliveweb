import { toMoney } from "lib/todot";
import Link from "next/link";

const FoodCard = ({ MaMonAn, TenMonAn, Gia, ImgUrl, CuaHang, className }) => {
  return (
    <>
      <Link
        href={`/food/${MaMonAn}`}
        className={`md:w-[25%] sm:w-52 w-full p-2 ${className}`}
      >
        <div className="rounded-md relative bg-white shadow-md sm:hover:shadow-lg sm:hover:scale-[1.005] transition-transform cursor-pointer">
          <div className="relative">
            <img
              src={ImgUrl}
              alt={TenMonAn}
              className="sm:object-cover object-contain bg-gray-100 object-center rounded-md w-full h-60 rounded-b-none"
            />
          </div>
          <div className="p-2">
            <p className="font-semibold text-xl opacity-80 whitespace-nowrap overflow-hidden text-ellipsis">
              {TenMonAn}
            </p>
            <div className="flex items-center gap-1">
              {CuaHang && (
                <img
                  src={CuaHang.ImgUrl || "/icon_foode_live.png"}
                  alt={CuaHang.TenCuaHang}
                  className="w-4 h-4 rounded-full object-center object-cover"
                />
              )}
              {CuaHang && (
                <span className="text-xs opacity-70">{CuaHang.TenCuaHang}</span>
              )}
            </div>
            <p className="text-[#ff7a00] font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
              {toMoney(Gia)}
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default FoodCard;
