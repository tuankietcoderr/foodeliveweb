import prisma from "lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "PUT":
      try {
        const { email, fullName, phoneNumber, address } = req.body;
        const user = await prisma.user.update({
          where: {
            email: email,
          },
          data: {
            fullName,
            phoneNumber,
            address,
          },
        });
        res.status(200).json(user);
      } catch (error) {
        res.status(400).json(error);
      }
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).json({ message: "Method not allowed" });
  }
}
