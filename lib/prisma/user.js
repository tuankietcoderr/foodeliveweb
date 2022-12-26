import prisma from ".";

export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    return error;
  }
}

export async function updateUser(user) {
  try {
    const userFromDB = await prisma.user.update({ data: user });
    return { user: userFromDB };
  } catch (error) {
    return error;
  }
}

export async function getUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    return error;
  }
}
