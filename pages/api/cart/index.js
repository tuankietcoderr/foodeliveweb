import { addFoodToCart } from "lib/prisma/food";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: "Bạn chưa đăng nhập" });
  }
  switch (method) {
    case "GET":
      try {
        const { type } = req.query;
        let status;
        switch (type) {
          case "added":
            status = 0;
            break;
          case "waiting":
            status = 1;
            break;
          case "confirmed":
          case "delivering":
            status = 2;
            break;
          case "delivered":
            status = 4;
            break;
          case "cancelled":
            status = 5;
            break;
          default:
            status = 0;
            break;
        }
        const carts = await prisma.chiTietDonHang.findMany({
          where: {
            DonHang: {
              email: session.user.email,
            },
            TrangThai: status,
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
        res.status(200).json({ carts });
      } catch (error) {
        res.status(400).json({ error });
      }
      break;
    case "POST":
      try {
        const result = await addFoodToCart(req.body);
        res.status(200).json({ result });
      } catch (error) {
        res.status(400).json({ error });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
