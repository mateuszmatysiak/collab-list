import type { ListRole } from "@collab-list/shared/types";
import { and, eq } from "drizzle-orm";
import { db } from "../db/index";
import { categories, listItems, listShares, lists } from "../db/schema";
import { ForbiddenError, NotFoundError } from "../utils/errors";

async function checkListAccess(
	listId: string,
	userId: string,
): Promise<ListRole | null> {
	const [list] = await db
		.select()
		.from(lists)
		.where(eq(lists.id, listId))
		.limit(1);

	if (!list) {
		return null;
	}

	if (list.authorId === userId) {
		return "owner";
	}

	const [share] = await db
		.select()
		.from(listShares)
		.where(and(eq(listShares.listId, listId), eq(listShares.userId, userId)))
		.limit(1);

	if (share) {
		return share.role;
	}

	return null;
}

export async function getItems(listId: string, userId: string) {
	const access = await checkListAccess(listId, userId);

	if (!access) {
		throw new NotFoundError("Nie znaleziono listy");
	}

	const items = await db
		.select({
			id: listItems.id,
			listId: listItems.listId,
			title: listItems.title,
			description: listItems.description,
			isCompleted: listItems.isCompleted,
			categoryId: listItems.categoryId,
			categoryIcon: categories.icon,
			createdAt: listItems.createdAt,
		})
		.from(listItems)
		.leftJoin(categories, eq(listItems.categoryId, categories.id))
		.where(eq(listItems.listId, listId))
		.orderBy(listItems.createdAt);

	return items.map((item) => ({
		id: item.id,
		listId: item.listId,
		title: item.title,
		description: item.description,
		isCompleted: item.isCompleted,
		categoryId: item.categoryId,
		categoryIcon: item.categoryIcon ?? null,
		createdAt: item.createdAt,
	}));
}

export async function createItem(
	listId: string,
	userId: string,
	title: string,
	description?: string,
	categoryId?: string | null,
) {
	const access = await checkListAccess(listId, userId);

	if (!access) {
		throw new NotFoundError("Nie znaleziono listy");
	}

	if (access !== "owner" && access !== "editor") {
		throw new ForbiddenError(
			"Nie masz uprawnień do dodawania elementów do tej listy",
		);
	}

	const [item] = await db
		.insert(listItems)
		.values({
			listId,
			title,
			description,
			isCompleted: false,
			categoryId: categoryId || null,
		})
		.returning();

	if (!item) {
		throw new Error("Nie udało się utworzyć elementu listy");
	}

	const [itemWithCategory] = await db
		.select({
			id: listItems.id,
			listId: listItems.listId,
			title: listItems.title,
			description: listItems.description,
			isCompleted: listItems.isCompleted,
			categoryId: listItems.categoryId,
			categoryIcon: categories.icon,
			createdAt: listItems.createdAt,
		})
		.from(listItems)
		.leftJoin(categories, eq(listItems.categoryId, categories.id))
		.where(eq(listItems.id, item.id))
		.limit(1);

	if (!itemWithCategory) {
		throw new NotFoundError("Nie znaleziono utworzonego elementu");
	}

	return {
		id: itemWithCategory.id,
		listId: itemWithCategory.listId,
		title: itemWithCategory.title,
		description: itemWithCategory.description,
		isCompleted: itemWithCategory.isCompleted,
		categoryId: itemWithCategory.categoryId,
		categoryIcon: itemWithCategory.categoryIcon ?? null,
		createdAt: itemWithCategory.createdAt,
	};
}

export async function updateItem(
	itemId: string,
	listId: string,
	userId: string,
	data: {
		title?: string;
		description?: string;
		is_completed?: boolean;
		categoryId?: string | null;
	},
) {
	const access = await checkListAccess(listId, userId);

	if (!access) {
		throw new NotFoundError("Nie znaleziono listy");
	}

	if (access !== "owner" && access !== "editor") {
		throw new ForbiddenError(
			"Nie masz uprawnień do edycji elementów tej listy",
		);
	}

	const [item] = await db
		.select()
		.from(listItems)
		.where(eq(listItems.id, itemId))
		.limit(1);

	if (!item) {
		throw new NotFoundError("Nie znaleziono elementu listy");
	}

	if (item.listId !== listId) {
		throw new NotFoundError("Element nie należy do tej listy");
	}

	const updateData: {
		title?: string;
		description?: string;
		isCompleted?: boolean;
		categoryId?: string | null;
	} = {};

	if (data.title !== undefined) {
		updateData.title = data.title;
	}

	if (data.description !== undefined) {
		updateData.description = data.description;
	}

	if (data.is_completed !== undefined) {
		updateData.isCompleted = data.is_completed;
	}

	if (data.categoryId !== undefined) {
		updateData.categoryId = data.categoryId || null;
	}

	await db.update(listItems).set(updateData).where(eq(listItems.id, itemId));

	const [itemWithCategory] = await db
		.select({
			id: listItems.id,
			listId: listItems.listId,
			title: listItems.title,
			description: listItems.description,
			isCompleted: listItems.isCompleted,
			categoryId: listItems.categoryId,
			categoryIcon: categories.icon,
			createdAt: listItems.createdAt,
		})
		.from(listItems)
		.leftJoin(categories, eq(listItems.categoryId, categories.id))
		.where(eq(listItems.id, itemId))
		.limit(1);

	if (!itemWithCategory) {
		throw new NotFoundError("Nie znaleziono zaktualizowanego elementu");
	}

	return {
		id: itemWithCategory.id,
		listId: itemWithCategory.listId,
		title: itemWithCategory.title,
		description: itemWithCategory.description,
		isCompleted: itemWithCategory.isCompleted,
		categoryId: itemWithCategory.categoryId,
		categoryIcon: itemWithCategory.categoryIcon ?? null,
		createdAt: itemWithCategory.createdAt,
	};
}

export async function deleteItem(
	itemId: string,
	listId: string,
	userId: string,
) {
	const access = await checkListAccess(listId, userId);

	if (!access) {
		throw new NotFoundError("Nie znaleziono listy");
	}

	if (access !== "owner" && access !== "editor") {
		throw new ForbiddenError(
			"Nie masz uprawnień do usuwania elementów z tej listy",
		);
	}

	const [item] = await db
		.select()
		.from(listItems)
		.where(eq(listItems.id, itemId))
		.limit(1);

	if (!item) {
		throw new NotFoundError("Nie znaleziono elementu listy");
	}

	if (item.listId !== listId) {
		throw new NotFoundError("Element nie należy do tej listy");
	}

	await db.delete(listItems).where(eq(listItems.id, itemId));
}
