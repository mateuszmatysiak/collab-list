import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/index";
import { listShares, lists, users } from "../db/schema";
import { ConflictError, ForbiddenError, NotFoundError } from "../utils/errors";

const MAX_SHARES = 50;

async function checkListOwnership(
	listId: string,
	userId: string,
): Promise<boolean> {
	const [list] = await db
		.select()
		.from(lists)
		.where(eq(lists.id, listId))
		.limit(1);

	if (!list) {
		throw new NotFoundError("Nie znaleziono listy");
	}

	return list.authorId === userId;
}

export async function shareList(
	listId: string,
	ownerId: string,
	email: string,
) {
	const isOwner = await checkListOwnership(listId, ownerId);

	if (!isOwner) {
		throw new ForbiddenError("Tylko właściciel może udostępnić tę listę");
	}

	const [targetUser] = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	if (!targetUser) {
		throw new NotFoundError("Nie znaleziono użytkownika z tym emailem");
	}

	if (targetUser.id === ownerId) {
		throw new ConflictError("Nie możesz udostępnić listy samemu sobie");
	}

	const [existingShare] = await db
		.select()
		.from(listShares)
		.where(
			and(eq(listShares.listId, listId), eq(listShares.userId, targetUser.id)),
		)
		.limit(1);

	if (existingShare) {
		throw new ConflictError("Lista jest już udostępniona temu użytkownikowi");
	}

	const sharesResult = await db
		.select({
			count: sql<number>`count(*)::int`,
		})
		.from(listShares)
		.where(eq(listShares.listId, listId));

	const sharesCount = sharesResult[0]?.count || 0;

	if (sharesCount >= MAX_SHARES) {
		throw new ConflictError(
			`Maksymalna liczba udostępnionych użytkowników wynosi ${MAX_SHARES}`,
		);
	}

	const [share] = await db
		.insert(listShares)
		.values({
			listId,
			userId: targetUser.id,
			role: "editor",
		})
		.returning();

	return {
		...share,
		userName: targetUser.name,
	};
}

export async function removeShare(
	listId: string,
	ownerId: string,
	userId: string,
) {
	const isOwner = await checkListOwnership(listId, ownerId);

	if (!isOwner) {
		throw new ForbiddenError("Tylko właściciel może usunąć udostępnienia");
	}

	if (ownerId === userId) {
		throw new ConflictError("Nie możesz usunąć właściciela z listy");
	}

	const [share] = await db
		.select()
		.from(listShares)
		.where(and(eq(listShares.listId, listId), eq(listShares.userId, userId)))
		.limit(1);

	if (!share) {
		throw new NotFoundError("Nie znaleziono udostępnienia");
	}

	await db
		.delete(listShares)
		.where(and(eq(listShares.listId, listId), eq(listShares.userId, userId)));
}

export async function getListShares(listId: string, userId: string) {
	const [list] = await db
		.select()
		.from(lists)
		.where(eq(lists.id, listId))
		.limit(1);

	if (!list) {
		throw new NotFoundError("Nie znaleziono listy");
	}

	const isOwner = list.authorId === userId;

	if (!isOwner) {
		const [share] = await db
			.select()
			.from(listShares)
			.where(and(eq(listShares.listId, listId), eq(listShares.userId, userId)))
			.limit(1);

		if (!share) {
			throw new ForbiddenError("Nie masz dostępu do tej listy");
		}
	}

	const [author] = await db
		.select({
			id: users.id,
			name: users.name,
			email: users.email,
		})
		.from(users)
		.where(eq(users.id, list.authorId))
		.limit(1);

	const shares = await db
		.select({
			share: listShares,
			user: users,
		})
		.from(listShares)
		.innerJoin(users, eq(listShares.userId, users.id))
		.where(eq(listShares.listId, listId));

	return {
		shares: shares.map(({ share, user }) => ({
			id: share.id,
			userId: user.id,
			userName: user.name,
			userEmail: user.email,
			role: share.role,
			createdAt: share.createdAt,
		})),
		author,
	};
}
