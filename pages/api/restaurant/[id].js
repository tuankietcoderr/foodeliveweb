import prisma from "lib/prisma";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  switch (method) {
    case "GET":
      try {
        const restaurant = await prisma.cuaHang.findUnique({
          where: { id },
        });
        res.status(200).json({ restaurant });
      } catch (error) {
        res.status(400).json({ error });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
