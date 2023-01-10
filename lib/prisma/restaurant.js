import prisma from ".";

export const getRestaurants = async () => {
  const restaurants = await prisma.nhaHang.findMany();
  return restaurants;
};

export const getRestaurantById = async (id) => {
  const restaurant = await prisma.cuaHang.findUnique({
    where: {
      MaCuaHang: id,
    },
  });
  return restaurant;
};
