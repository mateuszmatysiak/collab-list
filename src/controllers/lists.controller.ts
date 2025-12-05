import type { Context } from "hono";
import { authMiddleware } from "../middleware/auth";
import {
	createList,
	deleteList,
	getListById,
	getUserLists,
	updateList,
} from "../services/lists.service";
import { createJsonValidator, getValidatedJson } from "../utils/validator";
import {
	createListSchema,
	updateListSchema,
} from "../validators/lists.validator";

export const getLists = [
	authMiddleware,
	async (c: Context) => {
		const userId = c.get("userId");

		const lists = await getUserLists(userId);

		return c.json({ lists });
	},
];

export const getList = [
	authMiddleware,
	async (c: Context) => {
		const userId = c.get("userId");
		const listId = c.req.param("id");

		const list = await getListById(listId, userId);

		return c.json({ list });
	},
];

export const createListController = [
	authMiddleware,
	createJsonValidator(createListSchema),
	async (c: Context) => {
		const userId = c.get("userId");
		const { name } = getValidatedJson(c, createListSchema);

		const list = await createList(userId, name);

		return c.json({ list }, 201);
	},
];

export const updateListController = [
	authMiddleware,
	createJsonValidator(updateListSchema),
	async (c: Context) => {
		const userId = c.get("userId");
		const listId = c.req.param("id");
		const { name } = getValidatedJson(c, updateListSchema);

		const list = await updateList(listId, userId, name);

		return c.json({ list });
	},
];

export const deleteListController = [
	authMiddleware,
	async (c: Context) => {
		const userId = c.get("userId");
		const listId = c.req.param("id");

		await deleteList(listId, userId);

		return c.json({ message: "Lista usunięta pomyślnie" });
	},
];
