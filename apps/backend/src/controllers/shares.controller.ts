import { shareListSchema } from "@collab-list/shared/validators";
import type { Context } from "hono";
import { authMiddleware } from "../middleware/auth";
import {
	getListShares,
	removeShare,
	shareList,
} from "../services/shares.service";
import { createJsonValidator, getValidatedJson } from "../utils/validator";

export const shareListController = [
	authMiddleware,
	createJsonValidator(shareListSchema),
	async (c: Context) => {
		const userId = c.get("userId");
		const listId = c.req.param("id");
		const { email } = getValidatedJson(c, shareListSchema);

		const share = await shareList(listId, userId, email);

		return c.json({ share }, 201);
	},
];

export const removeShareController = [
	authMiddleware,
	async (c: Context) => {
		const userId = c.get("userId");
		const listId = c.req.param("id");
		const targetUserId = c.req.param("userId");

		await removeShare(listId, userId, targetUserId);

		return c.json({ message: "Udostępnienie usunięte pomyślnie" });
	},
];

export const getListSharesController = [
	authMiddleware,
	async (c: Context) => {
		const userId = c.get("userId");
		const listId = c.req.param("id");

		const shares = await getListShares(listId, userId);

		return c.json({ shares });
	},
];
