export const getRestaurants = async () => {
  try {
    const restaurants = await prisma.nhaHang.findMany();
    return restaurants;
  } catch (error) {
    return error;
  }
};

export const getRestaurantById = async (id) => {
  try {
    const restaurant = await prisma.cuaHang.findUnique({
      where: {
        MaCuaHang: id,
      },
    });
    return restaurant;
  } catch (error) {
    return error;
  }
};
