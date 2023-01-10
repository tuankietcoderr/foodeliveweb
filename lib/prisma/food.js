import prisma from ".";

export const getFoods = async () => {
  const foods = await prisma.monAn.findMany();
  return foods;
};

export const getFoodById = async (id) => {
  const food = await prisma.monAn.findUnique({
    where: {
      MaMonAn: id,
    },
    include: {
      CuaHang: {
        include: {
          MonAn: true,
        },
      },
      Liked: true,
    },
  });
  return food;
};

export const addFoodToCart = async (data) => {
  const cart = await prisma.donHang.create({
    data: {
      TriGia: data.Gia,
      User: { connect: { email: data.email } },
      DiaChi: data.DiaChi,
      GhiChu: data.GhiChu,
      TrangThai: 0,
      NgayLapDonHang: new Date(),
    },
  });
  const chiTietDonHang = await prisma.chiTietDonHang.create({
    data: {
      MaDonHang: cart.MaDonHang,
      SoLuong: data.SoLuong,
      MaMonAn: data.MaMonAn,
    },
  });
  return { cart, chiTietDonHang };
};
