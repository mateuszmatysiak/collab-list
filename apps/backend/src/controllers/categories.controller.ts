import {
	createCategorySchema,
	updateCategorySchema,
} from "@collab-list/shared/validators";
import type { Context } from "hono";
import { authMiddleware } from "../middleware/auth";
import {
	createLocalCategory,
	createUserCategory,
	deleteUserCategory,
	getCategoriesForList,
	getUserCategories,
	updateUserCategory,
} from "../services/categories.service";
import { createJsonValidator, getValidatedJson } from "../utils/validator";

export const getUserCategoriesController = [
	authMiddleware,
	async (c: Context) => {
		const userId = c.get("userId");
		const categories = await getUserCategories(userId);

		return c.json({ categories });
	},
];

export const createUserCategoryController = [
	authMiddleware,
	createJsonValidator(createCategorySchema),
	async (c: Context) => {
		const userId = c.get("userId");
		const { name, icon } = getValidatedJson(c, createCategorySchema);

		const category = await createUserCategory(userId, name, icon);

		return c.json({ category }, 201);
	},
];

export const updateUserCategoryController = [
	authMiddleware,
	createJsonValidator(updateCategorySchema),
	async (c: Context) => {
		const userId = c.get("userId");
		const categoryId = c.req.param("id");
		const { name, icon } = getValidatedJson(c, updateCategorySchema);

		const category = await updateUserCategory(categoryId, userId, {
			name,
			icon,
		});

		return c.json({ category });
	},
];

export const deleteUserCategoryController = [
	authMiddleware,
	async (c: Context) => {
		const userId = c.get("userId");
		const categoryId = c.req.param("id");

		await deleteUserCategory(categoryId, userId);

		return c.json({ message: "Kategoria usunięta pomyślnie" });
	},
];

export const getListCategoriesController = [
	authMiddleware,
	async (c: Context) => {
		const userId = c.get("userId");
		const listId = c.req.param("listId");

		const categories = await getCategoriesForList(listId, userId);

		return c.json({ categories });
	},
];

export const createLocalCategoryController = [
	authMiddleware,
	createJsonValidator(createCategorySchema),
	async (c: Context) => {
		const userId = c.get("userId");
		const listId = c.req.param("listId");
		const { name, icon } = getValidatedJson(c, createCategorySchema);

		const category = await createLocalCategory(listId, userId, name, icon);

		return c.json({ category }, 201);
	},
];
