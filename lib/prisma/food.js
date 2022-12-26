import prisma from ".";

export const getFoods = async () => {
  try {
    const foods = await prisma.monAn.findMany();
    return foods;
  } catch (error) {
    return error;
  }
};

export const getFoodById = async (id) => {
  try {
    const food = await prisma.monAn.findUnique({
      where: {
        MaMonAn: id,
      },
    });
    return food;
  } catch (error) {
    return error;
  }
};
