import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { authMiddleware } from "./middlewares/auth.middleware";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import transactionRoutes from "./routes/transaction.routes";

const app = new Hono();

app.use("*", logger());

app.get("/", (c) => {
  return c.json({ message: "Bienvenido a la API de Cashi v2.0" });
});

app.route("/auth", authRoutes);
app.use("/categories/*", authMiddleware);
app.use("/transactions/*", authMiddleware);
app.route("/categories", categoryRoutes);
app.route("/transactions", transactionRoutes);
app.notFound((c) => {
  return c.json({ error: "Ruta no encontrada" }, 404);
});

const PORT = Number(process.env.PORT) || 3000;

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
