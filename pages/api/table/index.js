export default async function handler(req, res) {
  const { id } = req.query;
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const restaurant = await prisma.cuaHang.findUnique({
          where: {
            MaCuaHang: id,
          },
          include: {
            BanAn: true,
            MonAn: true,
            NguoiQuanLy: true,
          },
        });
        delete restaurant.NguoiQuanLy[0].MatKhau;
        res.status(200).json(restaurant);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        const restaurant = await prisma.cuaHang.update({
          where: {
            MaCuaHang: id,
          },
          data: req.body,
        });
        res.status(200).json(restaurant);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const restaurant = await prisma.cuaHang.create({
          data: req.body,
        });
        res.status(200).json(restaurant);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
