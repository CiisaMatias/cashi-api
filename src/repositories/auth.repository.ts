import prisma from "../lib/prisma";

export const authRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  create(email: string, passwordHash: string) {
    return prisma.user.create({
      data: { email, passwordHash },
    });
  },
};
