import FoodCard from "components/Body/Food";
import { SearchBar } from "components/index";
import { FoodContext } from "context/FoodContext";
import { useContext, useEffect, useRef, useState } from "react";

const Home = () => {
  const { foods, foodLoading } = useContext(FoodContext);
  return (
    <>
      <div>
        <SearchBar />
        <div className="mt-10">
          {foodLoading && <p>Loading...</p>}
          <div className={`flex flex-wrap md:justify-start justify-between`}>
            {foods &&
              foods.map((food) => <FoodCard {...food} key={food.MaMonAn} />)}
            {foods && foods.length === 0 && (
              <p className="mt-4 text-gray-400">Chưa có món ăn nào</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
