import { Hono } from "hono";
import {
	createCategoryController,
	deleteCategoryController,
	getCategoriesController,
	updateCategoryController,
} from "../controllers/categories.controller";

const categoriesRoutes = new Hono();

categoriesRoutes.get("/", ...getCategoriesController);
categoriesRoutes.post("/", ...createCategoryController);
categoriesRoutes.patch("/:id", ...updateCategoryController);
categoriesRoutes.delete("/:id", ...deleteCategoryController);

export default categoriesRoutes;
