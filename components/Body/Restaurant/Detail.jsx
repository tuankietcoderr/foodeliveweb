import moment from "moment/moment";
import Link from "next/link";
import React from "react";

const RestaurantDetail = ({
  MaCuaHang,
  MaQuanLy,
  MoTa,
  TenCuaHang,
  NgayThanhLap,
  ImgUrl,
  DiaChi,
  MonAn,
}) => {
  return (
    <>
      <div className="grid md:grid-cols-[60%_40%] border bg-[#fafafa] gap-2 rounded overflow-hidden sm:hover:scale-[1.005] transition-transform">
        <div className="leading-8 p-2 flex flex-col justify-between">
          <div>
            <p className="font-semibold text-lg">{TenCuaHang}</p>
            <p className="italic text-xs opacity-70">
              Thành lập vào ngày {moment(NgayThanhLap).format("DD/MM/YYYY")}
            </p>
            {DiaChi && <p className="text-sm">{DiaChi}</p>}
            {MoTa && <p className="text-sm">{MoTa}</p>}
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm">
              Có{" "}
              <span className="text-[#ff7a00] underline font-semibold">
                {MonAn.length || 0}
              </span>{" "}
              món ăn
            </p>
            <Link href={`/restaurant/${MaCuaHang}`} className="self-end">
              <p className="sm:hover:underline sm:hover:text-[#ff7a00] font-semibold text-[#ff7a00] sm:text-black">
                Xem thêm
              </p>
            </Link>
          </div>
        </div>
        <div className="overflow-hidden">
          <img
            src={ImgUrl || "/logo_foode_live_big.png"}
            alt={TenCuaHang}
            className="w-full bg-white rounded object-contain h-44 object-center"
          />
        </div>
      </div>
    </>
  );
};

export default RestaurantDetail;
