import prisma from "lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "POST":
      try {
        const { email, MaCuaHang } = req.body;
        const liked = await prisma.likedRestaurant.create({
          data: {
            email,
            MaCuaHang,
          },
        });
        res.status(200).json(liked);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        const { email, MaCuaHang } = req.body;
        const liked = await prisma.likedRestaurant.delete({
          where: {
            MaCuaHang_email: {
              email,
              MaCuaHang,
            },
          },
        });
        res.status(200).json(liked);
      } catch (error) {
        console.log();
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.setHeader("Allow", ["POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
