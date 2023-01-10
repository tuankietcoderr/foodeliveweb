import prisma from "lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "POST":
      try {
        const { email, MaMonAn } = req.body;
        const liked = await prisma.likedFood.create({
          data: {
            email,
            MaMonAn,
          },
        });
        res.status(200).json(liked);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        const { email, MaMonAn } = req.body;
        const liked = await prisma.likedFood.delete({
          where: {
            MaMonAn_email: {
              email,
              MaMonAn,
            },
          },
        });
        res.status(200).json(liked);
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.setHeader("Allow", ["POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
