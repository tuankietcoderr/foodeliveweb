import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toMoney } from "lib/todot";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";
import { instance } from "utils/axios";

const CartAdded = ({ MonAn, SoLuong, TrangThai, DonHang, cartz, setCartz }) => {
  const [newQuantity, setNewQuantity] = React.useState(SoLuong);
  const CuaHang = MonAn.CuaHang;
  const handleBought = async () => {
    await instance
      .put(`/api/cart/${DonHang.MaDonHang}/${MonAn.MaMonAn}`, {
        SoLuong: newQuantity,
        TrangThai: 1,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        toast.success("Đặt hàng thành công");
        setCartz(cartz.filter((cart) => cart.MaDonHang != DonHang.MaDonHang));
      })
      .catch((err) => {
        console.log(err);
        toast.error("Đặt hàng thất bại");
      });
  };

  const handleCancel = async () => {
    await instance
      .put(`/api/cart/${DonHang.MaDonHang}/${MonAn.MaMonAn}`, {
        SoLuong: newQuantity,
        TrangThai: 5,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        toast.success("Hủy đơn hàng thành công");
        setCartz(cartz.filter((cart) => cart.MaDonHang != DonHang.MaDonHang));
      })
      .catch((err) => {
        console.log(err);
        toast.error("Hủy đơn hàng thất bại");
      });
  };

  return (
    <>
      <div
        className="grid sm:grid-cols-[30%_70%] gap-2 mb-2 shadow-md rounded p-2"
        id={DonHang.MaDonHang}
      >
        <div>
          <img src={MonAn.ImgUrl} alt={MonAn.TenMonAn} className="rounded" />
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
              {toMoney(MonAn.Gia * newQuantity)}
            </p>
            <p className="text-sm my-2">{DonHang.DiaChi}</p>
          </div>
          <div className="flex sm:flex-row flex-col sm:items-center gap-2 justify-between ">
            <div className="flex gap-2 items-center">
              <p>Số lượng:</p>
              <button
                className={`${
                  newQuantity == 1
                    ? "opacity-50 sm:hover:bg-none"
                    : "opacity-100 sm:hover:bg-gray-200"
                } bg-white border rounded-sm items-center px-1 
                transition-colors`}
                disabled={newQuantity == 1}
                onClick={() => {
                  if (newQuantity == 1) {
                    return;
                  }
                  setNewQuantity((prev) => parseInt(prev) - 1);
                }}
              >
                <FontAwesomeIcon icon={faMinus} />{" "}
              </button>
              <label>
                <input
                  type="text"
                  value={newQuantity || 1}
                  className="w-8 text-center outline-none"
                  onChange={(e) => {
                    if (
                      e.target.value == 0 ||
                      e.target.value == "" ||
                      e.target.value == "-" ||
                      e.target.value == "0" ||
                      e.target.value < 0 ||
                      e.target.value < "0"
                    ) {
                      setNewQuantity(1);
                      return;
                    }
                    setNewQuantity(parseInt(e.target.value));
                  }}
                />
              </label>
              <button
                className="bg-white border rounded-sm items-center px-1 sm:hover:bg-gray-200 transition-colors"
                onClick={() => {
                  setNewQuantity((prev) => parseInt(prev || 1) + 1);
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <div className="flex sm:flex-row flex-col-reverse gap-2">
              <button
                className="text-red-500 sm:hover:bg-red-500 font-semibold sm:hover:text-white py-1 px-3 rounded"
                onClick={handleCancel}
              >
                Hủy đơn
              </button>
              <button
                className="bg-[#ff7a00] text-white px-4 py-1 rounded sm:mr-2 sm:hover:opacity-80 transition-opacity"
                onClick={handleBought}
              >
                Đặt ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartAdded;
