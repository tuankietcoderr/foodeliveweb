import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });
  switch (method) {
    case "GET":
      try {
        const notification = await prisma.thongBao.findMany({
          where: {
            DonHang: {
              email: session.user.email,
            },
          },
          include: {
            BanAn: true,
            MonAn: true,
            DonHang: true,
          },
        });
        res.status(200).json(notification);
      } catch (error) {
        res.status(400).json(error);
      }
      break;
    case "POST":
      try {
        let temp;
        if (req.body.MaDatBan) {
          const notification = await prisma.thongBao.create({
            data: {
              ChiTietDatBan: {
                connect: {
                  MaDatBan: req.body.MaDatBan,
                },
              },
            },
          });
          temp = notification;
        } else if (req.body.MaDonHang) {
          const notification = await prisma.thongBao.create({
            data: {
              DonHang: {
                connect: {
                  MaDonHang: req.body.MaDonHang,
                },
              },
            },
          });
          temp = notification;
        }
        res.status(200).json(temp);
      } catch (error) {
        console.log(error);
        res.status(400).json(error);
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
