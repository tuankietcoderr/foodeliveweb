import { createContext, useEffect, useState } from "react";
import { instance } from "utils/axios";

export const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState(null);
  const [foodLoading, setFoodLoading] = useState(true);
  useEffect(() => {
    instance
      .get("/api/food")
      .then((res) => {
        setFoods(res.data.foods);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setFoodLoading(false);
      });
  }, []);
  const value = {
    foods,
    setFoods,
    foodLoading,
    setFoodLoading,
  };
  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
};
