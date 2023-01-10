import React from "react";
import RestaurantDetail from "components/Body/Restaurant/Detail";

export const getServerSideProps = async ({ req }) => {
  const restaurants = await prisma.cuaHang.findMany({
    include: {
      MonAn: true,
    },
  });
  return {
    props: {
      restaurants: JSON.stringify(restaurants),
    },
  };
};

const Restaurant = ({ restaurants }) => {
  restaurants = JSON.parse(restaurants);
  console.log(restaurants);
  return (
    <div>
      <h1 className="font-bold text-2xl mb-4">Tất cả nhà hàng</h1>
      <div className="flex flex-col gap-4">
        {restaurants.map((restaurant) => (
          <RestaurantDetail {...restaurant} key={restaurant.MaCuaHang} />
        ))}
      </div>
    </div>
  );
};

export default Restaurant;
