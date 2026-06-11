import { Context } from "hono";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authRepository } from "../repositories/auth.repository";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

export const authController = {
  async register(c: Context) {
    const body = await c.req.json();

    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return c.json({ error: result.error.flatten() }, 400);
    }

    const { email, password } = result.data;
    const exists = await authRepository.findByEmail(email);
    if (exists) {
      return c.json({ error: "El email ya está registrado" }, 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await authRepository.create(email, passwordHash);
    const secret = process.env.JWT_SECRET || "secreto";
    const token = jwt.sign({ userId: user.id, email: user.email }, secret, {
      expiresIn: "7d",
    });

    return c.json({ token }, 201);
  },

  async login(c: Context) {
    const body = await c.req.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return c.json({ error: result.error.flatten() }, 400);
    }

    const { email, password } = result.data;
    const user = await authRepository.findByEmail(email);
    if (!user) {
      return c.json({ error: "Email o contraseña incorrectos" }, 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return c.json({ error: "Email o contraseña incorrectos" }, 401);
    }

    const secret = process.env.JWT_SECRET || "secreto";
    const token = jwt.sign({ userId: user.id, email: user.email }, secret, {
      expiresIn: "7d",
    });

    return c.json({ token });
  },
};
