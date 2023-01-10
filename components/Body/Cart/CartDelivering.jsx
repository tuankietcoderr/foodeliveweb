import { toMoney } from "lib/todot";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";
import { instance } from "utils/axios";

const CartDelivering = ({
  MonAn,
  SoLuong,
  TrangThai,
  DonHang,
  cartz,
  setCartz,
}) => {
  const CuaHang = MonAn.CuaHang;

  const handleDelivered = async () => {
    await instance
      .put(`/api/cart/${DonHang.MaDonHang}/${MonAn.MaMonAn}`, {
        TrangThai: 4,
        SoLuong: SoLuong,
      })
      .then((res) => res.data)
      .then((data) => {
        toast.success("Cảm ơn bạn đã xác nhận!");
        setCartz(cartz.filter((cart) => cart.MaDonHang != DonHang.MaDonHang));
      })
      .catch((err) => {
        console.log(err);
        toast.error("Xác nhận thất bại");
      });
  };

  return (
    <>
      <div
        className="grid sm:grid-cols-[30%_70%] gap-2 mb-2 shadow-md rounded p-2"
        id={DonHang.MaDonHang}
      >
        <div>
          <img
            src={MonAn.ImgUrl}
            alt={MonAn.TenMonAn}
            className="rounded object-cover"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <Link href={`/food/${MonAn.MaMonAn}`}>
              <h2 className="text-xl font-semibold mb-2">{MonAn.TenMonAn}</h2>
            </Link>
            <Link href={`/restaurant/${MonAn.MaCuaHang}`}>
              <div className="flex items-center gap-1">
                <img
                  src={CuaHang.ImgUrl || "/icon_foode_live.png"}
                  alt={CuaHang.TenCuaHang}
                  className="w-4 h-4 rounded-full object-center object-cover"
                />
                <span className="text-xs opacity-70">{CuaHang.TenCuaHang}</span>
              </div>
            </Link>
            <p className="text-[#ff7a00] text-xl my-2 font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
              {toMoney(MonAn.Gia * SoLuong)}
            </p>
            <p className="text-sm my-2">{DonHang.DiaChi}</p>
          </div>
          <div className="flex sm:flex-row flex-col sm:items-end gap-2 justify-between ">
            <p className="text-xs ">Số lượng: {SoLuong}</p>
            <button
              className="text-center bg-[#ff7a00] rounded text-white px-3 py-2 font-semibold text-sm sm:mr-2 sm:hover:opacity-80 transition-opacity"
              onClick={handleDelivered}
            >
              Đã nhận được hàng
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDelivering;
