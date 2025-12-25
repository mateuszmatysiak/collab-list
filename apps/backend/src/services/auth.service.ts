import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { systemCategories, userCategories, users } from "../db/schema";
import {
	AppError,
	ConflictError,
	NotFoundError,
	UnauthorizedError,
} from "../utils/errors";
import { hashPassword, verifyPassword } from "../utils/password";

async function copySystemCategoriesToUser(userId: string) {
	const systemCats = await db.select().from(systemCategories);

	if (systemCats.length === 0) {
		return;
	}

	await db.insert(userCategories).values(
		systemCats.map((cat) => ({
			userId,
			name: cat.name,
			icon: cat.icon,
			listId: null,
		})),
	);
}

export async function createUser(
	name: string,
	email: string,
	password: string,
) {
	const existingUser = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	if (existingUser.length > 0) {
		throw new ConflictError("Użytkownik o takim emailu już istnieje");
	}

	const passwordHash = await hashPassword(password);

	const [user] = await db
		.insert(users)
		.values({
			name,
			email,
			passwordHash,
		})
		.returning();

	if (!user) {
		throw new AppError(
			"Nie udało się utworzyć użytkownika",
			500,
			"CREATE_ERROR",
		);
	}

	await copySystemCategoriesToUser(user.id);

	return user;
}

export async function authenticateUser(email: string, password: string) {
	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	if (!user) {
		throw new UnauthorizedError("Nieprawidłowy email lub hasło");
	}

	const isValid = await verifyPassword(password, user.passwordHash);

	if (!isValid) {
		throw new UnauthorizedError("Nieprawidłowy email lub hasło");
	}

	return user;
}

export async function getUserById(id: string) {
	const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);

	if (!user) {
		throw new NotFoundError("Użytkownik nie znaleziony");
	}

	return user;
}
