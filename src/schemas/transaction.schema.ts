import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number().positive("El monto debe ser mayor a 0"),
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: 'El tipo debe ser "income" o "expense"' }),
  }),
  description: z.string().optional(),
  date: z.string().optional(),
  receiptUrl: z.string().url("La URL del comprobante no es válida").optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  categoryId: z.number().int("El categoryId debe ser un número entero"),
});

export const updateTransactionSchema = z.object({
  amount: z.number().positive("El monto debe ser mayor a 0").optional(),
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: 'El tipo debe ser "income" o "expense"' }),
  }).optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  receiptUrl: z.string().url("La URL del comprobante no es válida").optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  categoryId: z.number().int("El categoryId debe ser un número entero").optional(),
});
