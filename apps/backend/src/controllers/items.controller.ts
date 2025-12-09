import {
	createItemSchema,
	updateItemSchema,
} from "@collab-list/shared/validators";
import type { Context } from "hono";
import { authMiddleware } from "../middleware/auth";
import { createItem, deleteItem, updateItem } from "../services/items.service";
import { createJsonValidator, getValidatedJson } from "../utils/validator";

export const createItemController = [
	authMiddleware,
	createJsonValidator(createItemSchema),
	async (c: Context) => {
		const userId = c.get("userId");
		const listId = c.req.param("listId");
		const { title } = getValidatedJson(c, createItemSchema);

		const item = await createItem(listId, userId, title);

		return c.json({ item }, 201);
	},
];

export const updateItemController = [
	authMiddleware,
	createJsonValidator(updateItemSchema),
	async (c: Context) => {
		const userId = c.get("userId");
		const listId = c.req.param("listId");
		const itemId = c.req.param("itemId");
		const data = getValidatedJson(c, updateItemSchema);

		const item = await updateItem(itemId, listId, userId, data);

		return c.json({ item });
	},
];

export const deleteItemController = [
	authMiddleware,
	async (c: Context) => {
		const userId = c.get("userId");
		const listId = c.req.param("listId");
		const itemId = c.req.param("itemId");

		await deleteItem(itemId, listId, userId);

		return c.json({ message: "Element usunięty pomyślnie" });
	},
];
