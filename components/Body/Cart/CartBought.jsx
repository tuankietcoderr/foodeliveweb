import { toMoney } from "lib/todot";
import Link from "next/link";

const CartBought = ({
  MonAn,
  SoLuong,
  TrangThai,
  DonHang,
  cartz,
  setCartz,
}) => {
  const CuaHang = MonAn.CuaHang;

  return (
    <div
      className="grid sm:grid-cols-[30%_70%] gap-2 mb-2 shadow-md rounded p-2"
      id={DonHang.MaDonHang}
    >
      <div>
        <img src={MonAn.ImgUrl} alt={MonAn.TenMonAn} className="rounded" />
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">{MonAn.TenMonAn}</h2>
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
        <div className="flex sm:flex-row flex-col sm:items-center gap-2 justify-between ">
          <p className="text-xs ">Số lượng: {SoLuong}</p>
          <button className="bg-[#ff7a00] text-white px-4 py-1 rounded sm:mr-2 sm:hover:opacity-80 transition-opacity">
            Đã nhận được hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartBought;
