import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/index";
import { listItems, listShares, lists } from "../db/schema";
import { ForbiddenError, NotFoundError } from "../utils/errors";

export async function createList(userId: string, name: string) {
	const [list] = await db
		.insert(lists)
		.values({
			name,
			authorId: userId,
		})
		.returning();

	return list;
}

async function checkListAccess(
	listId: string,
	userId: string,
): Promise<"owner" | "editor" | null> {
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

export async function getListById(listId: string, userId: string) {
	const access = await checkListAccess(listId, userId);

	if (!access) {
		throw new NotFoundError("Nie znaleziono listy");
	}

	const [list] = await db
		.select()
		.from(lists)
		.where(eq(lists.id, listId))
		.limit(1);

	if (!list) {
		throw new NotFoundError("Nie znaleziono listy");
	}

	const itemsResult = await db
		.select({
			total: sql<number>`count(*)::int`,
			completed: sql<number>`count(*) filter (where ${listItems.isCompleted} = true)::int`,
		})
		.from(listItems)
		.where(eq(listItems.listId, listId));

	const itemsCount = itemsResult[0]?.total || 0;
	const completedCount = itemsResult[0]?.completed || 0;

	const sharesResult = await db
		.select({
			count: sql<number>`count(*)::int`,
		})
		.from(listShares)
		.where(eq(listShares.listId, listId));

	const sharesCount = sharesResult[0]?.count || 0;

	return {
		...list,
		itemsCount,
		completedCount,
		sharesCount,
		role: access,
	};
}

export async function getUserLists(userId: string) {
	const ownedLists = await db
		.select()
		.from(lists)
		.where(eq(lists.authorId, userId));

	const sharedListsData = await db
		.select({
			list: lists,
			share: listShares,
		})
		.from(listShares)
		.innerJoin(lists, eq(listShares.listId, lists.id))
		.where(eq(listShares.userId, userId));

	const allLists = [
		...ownedLists.map((list) => ({ list, role: "owner" as const })),
		...sharedListsData.map(({ list, share }) => ({ list, role: share.role })),
	];

	const listsWithData = await Promise.all(
		allLists.map(async ({ list, role }) => {
			const itemsResult = await db
				.select({
					total: sql<number>`count(*)::int`,
					completed: sql<number>`count(*) filter (where ${listItems.isCompleted} = true)::int`,
				})
				.from(listItems)
				.where(eq(listItems.listId, list.id));

			const itemsCount = itemsResult[0]?.total || 0;
			const completedCount = itemsResult[0]?.completed || 0;

			const sharesResult = await db
				.select({
					count: sql<number>`count(*)::int`,
				})
				.from(listShares)
				.where(eq(listShares.listId, list.id));

			const sharesCount = sharesResult[0]?.count || 0;

			return {
				...list,
				itemsCount,
				completedCount,
				sharesCount,
				role,
			};
		}),
	);

	return listsWithData;
}

export async function updateList(listId: string, userId: string, name: string) {
	const access = await checkListAccess(listId, userId);

	if (!access) {
		throw new NotFoundError("Nie znaleziono listy");
	}

	if (access !== "owner" && access !== "editor") {
		throw new ForbiddenError("Nie masz uprawnień do edycji tej listy");
	}

	const [updatedList] = await db
		.update(lists)
		.set({ name })
		.where(eq(lists.id, listId))
		.returning();

	if (!updatedList) {
		throw new NotFoundError("Nie znaleziono listy");
	}

	return updatedList;
}

export async function deleteList(listId: string, userId: string) {
	const access = await checkListAccess(listId, userId);

	if (!access) {
		throw new NotFoundError("Nie znaleziono listy");
	}

	if (access !== "owner") {
		throw new ForbiddenError("Tylko właściciel może usunąć tę listę");
	}

	await db.delete(lists).where(eq(lists.id, listId));
}
