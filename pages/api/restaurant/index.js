import prisma from "lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const restaurants = await prisma.cuaHang.findMany();
        res.status(200).json({ restaurants });
      } catch (error) {
        res.status(400).json({ error });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
