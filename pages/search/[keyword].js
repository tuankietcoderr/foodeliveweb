import FoodCard from "components/Body/Food";
import RestaurantDetail from "components/Body/Restaurant/Detail";
import { SearchBar } from "components/index";
import prisma from "lib/prisma";
import { convertToUnSign } from "lib/vietnamese-string";
import React, { useCallback, useState } from "react";

export const getServerSideProps = async ({ params }) => {
  const { keyword } = params;
  const caseClearMark = convertToUnSign(keyword);
  const foods = await prisma.monAn.findMany({
    where: {
      TenMonAnKhongDau: {
        contains: caseClearMark,
      },
    },
    include: {
      CuaHang: true,
    },
  });
  const restaurants = await prisma.cuaHang.findMany({
    where: {
      TenCuaHangKhongDau: {
        contains: caseClearMark,
      },
    },
    include: {
      MonAn: true,
    },
  });
  return {
    props: {
      foods: JSON.stringify(foods),
      keyword,
      restaurants: JSON.stringify(restaurants),
    },
  };
};

const SeachPage = ({ foods, keyword, restaurants }) => {
  foods = JSON.parse(foods);
  restaurants = JSON.parse(restaurants);
  const [type, setType] = useState("foods");
  const RenderFunc = useCallback(() => {
    switch (type) {
      case "foods":
        return (
          <>
            <div className={`flex flex-wrap md:justify-start justify-between`}>
              {foods &&
                foods.map((food) => <FoodCard {...food} key={food.MaMonAn} />)}
              {foods && foods.length === 0 && (
                <p className="mt-4 text-gray-400">
                  Không có món ăn nào với từ khóa tìm kiếm "{keyword}"
                </p>
              )}
            </div>
          </>
        );
      case "restaurants":
        return (
          <>
            <div className="flex flex-col gap-4">
              {restaurants.map((restaurant) => (
                <RestaurantDetail {...restaurant} key={restaurant.MaCuaHang} />
              ))}
              {restaurants && restaurants.length === 0 && (
                <p className="mt-4 text-gray-400">
                  Không có nhà hàng nào với từ khóa tìm kiếm "{keyword}"
                </p>
              )}
            </div>
          </>
        );
      default:
        return <p>Not found</p>;
    }
  }, [type, keyword]);

  return (
    <>
      <SearchBar />
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
      <RenderFunc />
    </>
  );
};

export default SeachPage;
