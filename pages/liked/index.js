import FoodCard from "components/Body/Food";
import RestaurantDetail from "components/Body/Restaurant/Detail";
import { getSession } from "next-auth/react";
import React, { useCallback, useState } from "react";

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  const likedFoods = await prisma.likedFood.findMany({
    where: {
      email: session.user.email,
    },
    include: {
      MonAn: true,
    },
  });
  const likedRestaurants = await prisma.likedRestaurant.findMany({
    where: {
      email: session.user.email,
    },
    include: {
      CuaHang: {
        include: {
          MonAn: true,
        },
      },
    },
  });
  return {
    props: {
      likedFoods: JSON.stringify(likedFoods),
      likedRestaurants: JSON.stringify(likedRestaurants),
    },
  };
};

const Liked = ({ likedFoods, likedRestaurants }) => {
  likedFoods = JSON.parse(likedFoods);
  likedRestaurants = JSON.parse(likedRestaurants);
  const [type, setType] = useState("foods");
  const RennderFunc = useCallback(() => {
    switch (type) {
      case "foods":
        return (
          <>
            <div className={`flex flex-wrap md:justify-start justify-between`}>
              {likedFoods &&
                likedFoods.map((food) => (
                  <FoodCard {...food.MonAn} key={food.MonAn.MaMonAn} />
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

  return (
    <>
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
    </>
  );
};

export default Liked;
