import {
	createCategorySchema,
	updateCategorySchema,
} from "@collab-list/shared/validators";
import type { Context } from "hono";
import { authMiddleware } from "../middleware/auth";
import {
	createCategory,
	deleteCategory,
	getAllCategories,
	updateCategory,
} from "../services/categories.service";
import { createJsonValidator, getValidatedJson } from "../utils/validator";

export const getCategoriesController = [
	authMiddleware,
	async (c: Context) => {
		const categories = await getAllCategories();

		return c.json({ categories });
	},
];

export const createCategoryController = [
	authMiddleware,
	createJsonValidator(createCategorySchema),
	async (c: Context) => {
		const { name, icon } = getValidatedJson(c, createCategorySchema);

		const category = await createCategory(name, icon);

		return c.json({ category }, 201);
	},
];

export const updateCategoryController = [
	authMiddleware,
	createJsonValidator(updateCategorySchema),
	async (c: Context) => {
		const categoryId = c.req.param("id");
		const { name, icon } = getValidatedJson(c, updateCategorySchema);

		const category = await updateCategory(categoryId, name, icon);

		return c.json({ category });
	},
];

export const deleteCategoryController = [
	authMiddleware,
	async (c: Context) => {
		const categoryId = c.req.param("id");

		await deleteCategory(categoryId);

		return c.json({ message: "Kategoria usunięta pomyślnie" });
	},
];
