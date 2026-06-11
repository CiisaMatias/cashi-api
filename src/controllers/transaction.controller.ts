import { Context } from "hono";
import { transactionRepository } from "../repositories/transaction.repository";
import { createTransactionSchema, updateTransactionSchema } from "../schemas/transaction.schema";

export const transactionController = {
  async getAll(c: Context) {
    const userId = c.get("userId") as number;
    const transactions = await transactionRepository.findAllByUser(userId);
    return c.json(transactions);
  },

  async getBalance(c: Context) {
    const userId = c.get("userId") as number;
    const transactions = await transactionRepository.findAllForBalance(userId);

    let totalIncome = 0;
    let totalExpense = 0;

    for (const tx of transactions) {
      if (tx.type === "income") {
        totalIncome += tx.amount;
      } else if (tx.type === "expense") {
        totalExpense += tx.amount;
      }
    }

    return c.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  },

  async getById(c: Context) {
    const id = Number(c.req.param("id"));
    const userId = c.get("userId") as number;
    const transaction = await transactionRepository.findById(id);

    if (!transaction) {
      return c.json({ error: "Transacción no encontrada" }, 404);
    }

    if (transaction.userId !== userId) {
      return c.json({ error: "No tienes permiso para ver esta transacción" }, 403);
    }

    return c.json(transaction);
  },

  async create(c: Context) {
    const userId = c.get("userId") as number;
    const body = await c.req.json();
    const result = createTransactionSchema.safeParse(body);
    if (!result.success) {
      return c.json({ error: result.error.flatten() }, 400);
    }

    const transaction = await transactionRepository.create({
      ...result.data,
      date: result.data.date ? new Date(result.data.date) : new Date(),
      userId,
    });

    return c.json(transaction, 201);
  },

  async update(c: Context) {
    const id = Number(c.req.param("id"));
    const userId = c.get("userId") as number;
    const body = await c.req.json();
    const result = updateTransactionSchema.safeParse(body);
    if (!result.success) {
      return c.json({ error: result.error.flatten() }, 400);
    }

    const transaction = await transactionRepository.findById(id);
    if (!transaction) {
      return c.json({ error: "Transacción no encontrada" }, 404);
    }

    if (transaction.userId !== userId) {
      return c.json({ error: "No tienes permiso para editar esta transacción" }, 403);
    }

    const updated = await transactionRepository.update(id, {
      ...result.data,
      date: result.data.date ? new Date(result.data.date) : undefined,
    });

    return c.json(updated);
  },

  async remove(c: Context) {
    const id = Number(c.req.param("id"));
    const userId = c.get("userId") as number;
    const transaction = await transactionRepository.findById(id);
    if (!transaction) {
      return c.json({ error: "Transacción no encontrada" }, 404);
    }

    if (transaction.userId !== userId) {
      return c.json({ error: "No tienes permiso para eliminar esta transacción" }, 403);
    }

    await transactionRepository.delete(id);
    return c.json({ message: "Transacción eliminada correctamente" });
  },
};
