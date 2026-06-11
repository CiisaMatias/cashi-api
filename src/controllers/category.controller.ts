import { Context } from "hono";
import { categoryRepository } from "../repositories/category.repository";
import { createCategorySchema, updateCategorySchema } from "../schemas/category.schema";

export const categoryController = {
  async getAll(c: Context) {
    const categories = await categoryRepository.findAll();
    return c.json(categories);
  },

  async getById(c: Context) {
    const id = Number(c.req.param("id"));
    const category = await categoryRepository.findById(id);

    if (!category) {
      return c.json({ error: "Categoría no encontrada" }, 404);
    }

    return c.json(category);
  },

  async create(c: Context) {
    const body = await c.req.json();
    const result = createCategorySchema.safeParse(body);
    if (!result.success) {
      return c.json({ error: result.error.flatten() }, 400);
    }

    const category = await categoryRepository.create(result.data.name);
    return c.json(category, 201);
  },

  async update(c: Context) {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const result = updateCategorySchema.safeParse(body);
    if (!result.success) {
      return c.json({ error: result.error.flatten() }, 400);
    }

    const exists = await categoryRepository.findById(id);
    if (!exists) {
      return c.json({ error: "Categoría no encontrada" }, 404);
    }

    const category = await categoryRepository.update(id, result.data.name);
    return c.json(category);
  },

  async remove(c: Context) {
    const id = Number(c.req.param("id"));
    const exists = await categoryRepository.findById(id);
    if (!exists) {
      return c.json({ error: "Categoría no encontrada" }, 404);
    }

    await categoryRepository.delete(id);
    return c.json({ message: "Categoría eliminada correctamente" });
  },
};
