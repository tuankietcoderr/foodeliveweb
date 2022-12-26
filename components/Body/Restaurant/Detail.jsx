import moment from "moment/moment";
import React from "react";

const RestaurantDetail = ({
  MaCuaHang,
  MaQuanLy,
  MoTa,
  TenCuaHang,
  NgayThanhLap,
  ImgUrl,
  DiaChi,
}) => {
  return (
    <>
      <div className="grid md:grid-cols-[60%_40%] border bg-[#fafafa] gap-4 rounded overflow-hidden">
        <div className="leading-8 p-2">
          <p className="font-semibold text-lg">{TenCuaHang}</p>
          <p className="italic text-sm opacity-70">
            Thành lập vào ngày {moment(NgayThanhLap).format("DD/MM/YYYY")}
          </p>
          <p>{DiaChi || "Chưa có địa chỉ"}</p>
        </div>
        <div className=" overflow-hidden">
          <img
            src={ImgUrl || "/logo_foode_live_big.png"}
            alt={TenCuaHang}
            className="object-contain bg-white rounded object-center w-full"
          />
        </div>
      </div>
    </>
  );
};

export default RestaurantDetail;
