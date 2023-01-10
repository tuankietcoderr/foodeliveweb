import prisma from "lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const detail = await prisma.chiTietDatBan.findMany({});
        res.status(200).json(detail);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const req_data = req.body;
        const detail = await prisma.chiTietDatBan.create({
          data: {
            MaDatBan: req_data.MaDatBan,
            MaBanAn: req_data.MaBanAn,
            NguoiDat: req_data.NguoiDat,
            TrangThai: req_data.TrangThai,
            SoDienThoai: req_data.SoDienThoai,
            NgayDat: req_data.NgayDat,
            email: req_data.email,
          },
        });
        const notification = await prisma.thongBao.create({
          data: {
            MaDatBan: req_data.MaDatBan,
          },
        });
        res.status(200).json(detail, notification);
      } catch (error) {
        console.log(req.body);
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
