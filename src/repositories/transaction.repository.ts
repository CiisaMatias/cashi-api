import prisma from "../lib/prisma";

export const transactionRepository = {
  findAllByUser(userId: number) {
    return prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id: number) {
    return prisma.transaction.findUnique({
      where: { id },
      include: { category: true },
    });
  },

  findAllForBalance(userId: number) {
    return prisma.transaction.findMany({
      where: { userId },
      select: {
        amount: true,
        type: true,
      },
    });
  },

  create(data: {
    amount: number;
    type: string;
    description?: string;
    date?: Date;
    receiptUrl?: string;
    latitude?: number;
    longitude?: number;
    categoryId: number;
    userId: number;
  }) {
    return prisma.transaction.create({
      data,
      include: { category: true },
    });
  },

  update(id: number, data: {
    amount?: number;
    type?: string;
    description?: string;
    date?: Date;
    receiptUrl?: string;
    latitude?: number;
    longitude?: number;
    categoryId?: number;
  }) {
    return prisma.transaction.update({
      where: { id },
      data,
      include: { category: true },
    });
  },

  delete(id: number) {
    return prisma.transaction.delete({
      where: { id },
    });
  },
};
