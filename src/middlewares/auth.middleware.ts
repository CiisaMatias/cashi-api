import { Context, Next } from "hono";
import jwt from "jsonwebtoken";

type JwtPayload = {
  userId: number;
  email: string;
};

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Token no proporcionado" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "secreto";
    const payload = jwt.verify(token, secret) as JwtPayload;
    
    c.set("userId", payload.userId);
    c.set("userEmail", payload.email);

    await next();
  } catch {
    return c.json({ error: "Token inválido o expirado" }, 401);
  }
}
