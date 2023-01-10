import {
  faEnvelopeOpen,
  faLocation,
  faLocationDot,
  faMobileScreen,
  faPhoneAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FoodCard from "components/Body/Food";
import RestaurantDetail from "components/Body/Restaurant/Detail";
import UpdateAccount from "components/Modal/UpdateAccount";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { foodStatus } from "pages/notification";
import React, { useCallback, useState } from "react";

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      DonHang: {
        include: {
          ChiTietDonHang: {
            include: {
              MonAn: true,
            },
          },
        },
      },
      LikedFood: {
        include: {
          MonAn: true,
        },
      },
      LikedRestaurant: {
        include: {
          CuaHang: {
            include: {
              MonAn: true,
            },
          },
        },
      },
    },
  });
  return {
    props: {
      user: JSON.stringify(user),
    },
  };
};

const Account = ({ user }) => {
  user = JSON.parse(user);
  console.log(user);
  const [uUser, setUUser] = useState(user);
  const likedFoods = user.LikedFood;
  const likedRestaurants = user.LikedRestaurant;
  const [type, setType] = useState("foods");
  const RennderFunc = useCallback(() => {
    switch (type) {
      case "foods":
        return (
          <>
            <div className={`flex flex-wrap md:justify-start justify-between`}>
              {likedFoods &&
                likedFoods.map((food) => (
                  <FoodCard
                    {...food.MonAn}
                    key={food.MonAn.MaMonAn}
                    className="md:w-[28%] sm:w-40"
                  />
                ))}
              {likedFoods && likedFoods.length === 0 && (
                <p className="mt-4 text-gray-400">Trống</p>
              )}
            </div>
          </>
        );
      case "restaurants":
        return (
          <>
            <div className="flex flex-col gap-4">
              {likedRestaurants &&
                likedRestaurants.map((restaurant) => (
                  <RestaurantDetail
                    {...restaurant.CuaHang}
                    key={restaurant.CuaHang.MaCuaHang}
                  />
                ))}
              {likedRestaurants && likedRestaurants.length === 0 && (
                <p className="mt-4 text-gray-400">Trống</p>
              )}
            </div>
          </>
        );
      default:
        return (
          <>
            <p>Không tìm thấy</p>
          </>
        );
    }
  }, [type]);

  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="grid md:grid-cols-[30%_70%] gap-4 ">
        <div>
          <div className="grid gap-2 place-items-center self-start">
            <img
              src={user.image}
              className="w-full max-w-[6rem] border rounded"
            />
            <b>{uUser.fullName || user.name}</b>
          </div>
          <div className="my-4">
            <p>
              <FontAwesomeIcon icon={faMobileScreen} />{" "}
              {uUser.phoneNumber || "Chưa có"}
            </p>
            <p>
              <FontAwesomeIcon icon={faLocationDot} />{" "}
              {uUser.address || "Chưa có"}
            </p>
            <p>
              <FontAwesomeIcon icon={faEnvelopeOpen} /> {uUser.email}
            </p>
          </div>
          <div className="sm:grid place-items-center">
            <button
              className="bg-[#ff7a00] text-white py-1 px-2 rounded sm:hover:opacity-50 transition-opacity"
              onClick={() => setOpen(true)}
            >
              Cập nhật thông tin tài khoản
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Yêu thích</h2>
          <div className="sm:flex mb-4 grid grid-cols-2">
            <button
              className={`${
                type === "foods" ? "border-[#ff7a00]" : ""
              } border-b-[3px] py-2 px-4 sm:hover:bg-gray-200 sm:rounded-t whitespace-nowrap`}
              onClick={() => setType("foods")}
            >
              Món ăn
            </button>
            <button
              className={`${
                type === "restaurants" ? "border-[#ff7a00]" : ""
              } border-b-[3px] sm:hover:bg-gray-200 sm:rounded-t whitespace-nowrap px-4 py-2`}
              onClick={() => setType("restaurants")}
            >
              Nhà hàng
            </button>
          </div>
          <RennderFunc />
          <h2 className="text-2xl font-bold mb-4">Lịch sử đặt hàng</h2>
          <ul className="not">
            {user.DonHang.length > 0 ? (
              user.DonHang.map((order) => (
                <li key={order.MaDonHang} className="list-disc py-2 ml-4">
                  <Link
                    href={`${
                      foodStatus[order.ChiTietDonHang[0].TrangThai].link
                    }#${order.MaDonHang}`}
                  >
                    Đơn hàng{" "}
                    <b className="sm:hover:underline sm:hover:text-[#ff7a00]">
                      {order?.ChiTietDonHang[0].MonAn.TenMonAn}
                    </b>
                    {foodStatus[order.ChiTietDonHang[0].TrangThai].name}
                  </Link>
                </li>
              ))
            ) : (
              <p className="opacity-50">Trống</p>
            )}
          </ul>
        </div>
      </div>
      {open && (
        <UpdateAccount
          open={open}
          setOpen={setOpen}
          user={uUser}
          setUser={setUUser}
        />
      )}
    </>
  );
};

export default Account;
