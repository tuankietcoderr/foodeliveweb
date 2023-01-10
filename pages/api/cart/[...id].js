import prisma from "lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const cart = await prisma.chiTietDonHang.findUnique({
          where: {
            MaDonHang: id,
          },
          include: {
            MonAn: {
              include: {
                CuaHang: true,
              },
            },
            DonHang: true,
          },
        });
        res.status(200).json(cart);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        const { id } = req.query;
        const cart = await prisma.chiTietDonHang.update({
          where: {
            MaDonHang_MaMonAn: {
              MaDonHang: id[0],
              MaMonAn: id[1],
            },
          },
          data: {
            TrangThai: req.body.TrangThai,
            SoLuong: req.body.SoLuong,
          },
        });
        if (req.body.TrangThai === 5 || req.body.TrangThai === 4) {
          return res.status(200).json({ cart });
        }
        const thongBao = await prisma.thongBao.create({
          data: {
            MaDonHang: id[0],
            MaMonAn: id[1],
          },
        });
        res.status(200).json({ cart, thongBao });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    case "DELETE":
      try {
        const { id } = req.query;
        const cart = await prisma.chiTietDonHang.delete({
          where: {
            MaDonHang_MaMonAn: {
              MaDonHang: id[0],
              MaMonAn: id[1],
            },
          },
        });
        res.status(200).json(cart);
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
