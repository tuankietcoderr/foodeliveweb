import {
  faLocationDot,
  faMobileAlt,
  faHeart as faHeartSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FoodCard from "components/Body/Food";
import TableModal from "components/Modal/TableModal";
import prisma from "lib/prisma";
import React, { useState } from "react";
import { instance } from "utils/axios";
import { toast } from "react-toastify";
import { getSession, useSession } from "next-auth/react";

export const getServerSideProps = async ({ params, req }) => {
  const { id } = params;
  const session = await getSession({ req });
  const restaurant = await prisma.cuaHang.findUnique({
    where: {
      MaCuaHang: id,
    },
    include: {
      BanAn: {
        include: {
          ChiTietDatBan: true,
        },
      },
      MonAn: true,
      NguoiQuanLy: true,
      Liked: true,
    },
  });
  delete restaurant.NguoiQuanLy[0].MatKhau;
  const liked = !!restaurant.Liked.find(
    ({ email }) => email === session?.user?.email
  );
  return {
    props: {
      restaurant: JSON.stringify(restaurant),
      liked,
      user: session.user,
    },
  };
};

const CuaHangDetail = ({ restaurant, liked, user }) => {
  restaurant = JSON.parse(restaurant);
  const NguoiQuanLy = restaurant.NguoiQuanLy[0];

  const [isLiked, setIsLiked] = useState(liked);

  const { status } = useSession();

  const handleLiked = async () => {
    await instance
      .post("/api/liked/restaurant", {
        MaCuaHang: restaurant.MaCuaHang,
        email: user.email,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        toast.success("Đã thêm cửa hàng vào danh sách yêu thích");
        setIsLiked(true);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Đã có lỗi xảy ra");
      });
  };

  const handleDisliked = async () => {
    if (status === "unauthenticated") {
      return toast.error("Vui lòng đăng nhập để thực hiện chức năng này");
    }
    await instance
      .delete(`/api/liked/restaurant`, {
        data: {
          email: user.email,
          MaCuaHang: restaurant.MaCuaHang,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        toast.success("Đã xóa khỏi cửa hàng yêu thích");
        setIsLiked(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Đã có lỗi xảy ra");
      });
  };

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="grid sm:grid-cols-[40%_60%] gap-4">
        <div>
          <img
            src={restaurant.ImgUrl || "/logo_foode_live_big.png"}
            alt={restaurant.TenCuaHang}
            className="rounded object-center"
          />
        </div>
        <div className="flex flex-col justify-between gap-y-2">
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{restaurant.TenCuaHang}</h1>
              {!isLiked ? (
                <button onClick={handleLiked}>
                  <FontAwesomeIcon icon={faHeart} size="xl" color="#ff7a00" />{" "}
                </button>
              ) : (
                <button onClick={handleDisliked}>
                  <FontAwesomeIcon
                    icon={faHeartSolid}
                    size="xl"
                    color="#ff7a00"
                  />{" "}
                </button>
              )}
            </div>
            <p className="text-gray-500">
              <FontAwesomeIcon icon={faLocationDot} />{" "}
              {restaurant.DiaChi || "Chưa có địa chỉ"}
            </p>
            <a
              href={`tel:${NguoiQuanLy.SoDienThoai}`}
              className="text-gray-500"
            >
              <FontAwesomeIcon icon={faMobileAlt} />{" "}
              {NguoiQuanLy.SoDienThoai || "Chưa có số điện thoại"}
            </a>
          </div>
          <div>
            <button
              className="bg-[#ff7a00] sm:hover:opacity-70 transition-opacity text-white rounded px-4 py-1"
              onClick={() => setShowModal(true)}
            >
              Đặt bàn
            </button>
          </div>
        </div>
      </div>
      <div className="sm:my-4 my-2">
        <h2 className="text-2xl font-semibold">Thực đơn</h2>
        <div className="flex flex-wrap md:justify-start justify-between">
          {restaurant.MonAn.map((food) => (
            <FoodCard key={food.MaMonAn} {...food} />
          ))}
        </div>
      </div>
      {showModal && (
        <TableModal setShowModal={setShowModal} table={restaurant.BanAn} />
      )}
    </>
  );
};

export default CuaHangDetail;
