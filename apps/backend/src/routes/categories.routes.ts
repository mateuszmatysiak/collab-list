import { Hono } from "hono";
import {
	createCategoryController,
	createCategoryItemController,
	deleteCategoryController,
	deleteCategoryItemController,
	getCategoriesController,
	getCategoryController,
	getCategoryItemsController,
	searchCategoryItemsController,
	updateCategoryController,
	updateCategoryItemController,
} from "../controllers/categories.controller";

const categoriesRoutes = new Hono();

// Search must be before /:id to avoid conflict
categoriesRoutes.get("/items/search", ...searchCategoryItemsController);

categoriesRoutes.get("/", ...getCategoriesController);
categoriesRoutes.get("/:id", ...getCategoryController);
categoriesRoutes.post("/", ...createCategoryController);
categoriesRoutes.patch("/:id", ...updateCategoryController);
categoriesRoutes.delete("/:id", ...deleteCategoryController);

categoriesRoutes.get("/:id/items", ...getCategoryItemsController);
categoriesRoutes.post("/:id/items", ...createCategoryItemController);
categoriesRoutes.patch("/:id/items/:itemId", ...updateCategoryItemController);
categoriesRoutes.delete("/:id/items/:itemId", ...deleteCategoryItemController);

export default categoriesRoutes;
