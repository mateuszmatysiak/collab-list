import { Hono } from "hono";
import {
	createUserCategoryController,
	deleteUserCategoryController,
	getUserCategoriesController,
	updateUserCategoryController,
} from "../controllers/categories.controller";

const categoriesRoutes = new Hono();

categoriesRoutes.get("/user", ...getUserCategoriesController);
categoriesRoutes.post("/user", ...createUserCategoryController);
categoriesRoutes.patch("/:id", ...updateUserCategoryController);
categoriesRoutes.delete("/:id", ...deleteUserCategoryController);

export default categoriesRoutes;
