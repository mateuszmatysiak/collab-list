import {
	createCategoryItemSchema,
	createCategorySchema,
	updateCategoryItemSchema,
	updateCategorySchema,
} from "@collab-list/shared/validators";
import type { Context } from "hono";
import { authMiddleware } from "../middleware/auth";
import {
	createCategory,
	createCategoryItem,
	deleteCategory,
	deleteCategoryItem,
	getAllCategories,
	getCategoryById,
	getCategoryItems,
	searchCategoryItems,
	updateCategory,
	updateCategoryItem,
} from "../services/categories.service";
import { createJsonValidator, getValidatedJson } from "../utils/validator";

export const getCategoriesController = [
	authMiddleware,
	async (c: Context) => {
		const categories = await getAllCategories();

		return c.json({ categories });
	},
];

export const getCategoryController = [
	authMiddleware,
	async (c: Context) => {
		const categoryId = c.req.param("id");

		const category = await getCategoryById(categoryId);

		return c.json({ category });
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

export const getCategoryItemsController = [
	authMiddleware,
	async (c: Context) => {
		const categoryId = c.req.param("id");

		const items = await getCategoryItems(categoryId);

		return c.json({ items });
	},
];

export const createCategoryItemController = [
	authMiddleware,
	createJsonValidator(createCategoryItemSchema),
	async (c: Context) => {
		const categoryId = c.req.param("id");
		const { name } = getValidatedJson(c, createCategoryItemSchema);

		const item = await createCategoryItem(categoryId, name);

		return c.json({ item }, 201);
	},
];

export const updateCategoryItemController = [
	authMiddleware,
	createJsonValidator(updateCategoryItemSchema),
	async (c: Context) => {
		const itemId = c.req.param("itemId");
		const { name } = getValidatedJson(c, updateCategoryItemSchema);

		const item = await updateCategoryItem(itemId, name);

		return c.json({ item });
	},
];

export const deleteCategoryItemController = [
	authMiddleware,
	async (c: Context) => {
		const itemId = c.req.param("itemId");

		await deleteCategoryItem(itemId);

		return c.json({ message: "Element usunięty pomyślnie" });
	},
];

export const searchCategoryItemsController = [
	authMiddleware,
	async (c: Context) => {
		const query = c.req.query("q") || "";

		if (!query || query.length < 1) {
			return c.json({ items: [] });
		}

		const items = await searchCategoryItems(query);

		return c.json({ items });
	},
];
