import { Hono } from "hono";
import { transactionController } from "../controllers/transaction.controller";
import { uploadController } from "../controllers/upload.controller";

const transactionRoutes = new Hono();

transactionRoutes.get("/balance", transactionController.getBalance);
transactionRoutes.post("/upload", uploadController.uploadReceipt);
transactionRoutes.get("/", transactionController.getAll);
transactionRoutes.get("/:id", transactionController.getById);
transactionRoutes.post("/", transactionController.create);
transactionRoutes.patch("/:id", transactionController.update);
transactionRoutes.delete("/:id", transactionController.remove);

export default transactionRoutes;
