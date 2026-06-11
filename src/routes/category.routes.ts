import { Hono } from "hono";
import { categoryController } from "../controllers/category.controller";

const categoryRoutes = new Hono();

categoryRoutes.get("/", categoryController.getAll);
categoryRoutes.get("/:id", categoryController.getById);
categoryRoutes.post("/", categoryController.create);
categoryRoutes.patch("/:id", categoryController.update);
categoryRoutes.delete("/:id", categoryController.remove);

export default categoryRoutes;
