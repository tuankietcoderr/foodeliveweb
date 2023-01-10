import prisma from ".";

export async function getUsers() {
  const users = await prisma.user.findMany();
  return users;
}

export async function updateUser(user) {
  const userFromDB = await prisma.user.update({ data: user });
  return { user: userFromDB };
}

export async function getUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
}
