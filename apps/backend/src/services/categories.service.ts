import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { categories, listItems } from "../db/schema";
import { NotFoundError } from "../utils/errors";

export async function getAllCategories() {
	const allCategories = await db
		.select({
			id: categories.id,
			name: categories.name,
			icon: categories.icon,
			createdAt: categories.createdAt,
		})
		.from(categories)
		.leftJoin(listItems, eq(categories.id, listItems.categoryId))
		.groupBy(categories.id)
		.orderBy(categories.name);

	return allCategories;
}

export async function createCategory(name: string, icon: string) {
	const [category] = await db
		.insert(categories)
		.values({
			name,
			icon,
		})
		.returning();

	return category;
}

export async function updateCategory(
	categoryId: string,
	name: string,
	icon: string,
) {
	const [category] = await db
		.select()
		.from(categories)
		.where(eq(categories.id, categoryId))
		.limit(1);

	if (!category) {
		throw new NotFoundError("Nie znaleziono kategorii");
	}

	const [updatedCategory] = await db
		.update(categories)
		.set({ name, icon })
		.where(eq(categories.id, categoryId))
		.returning();

	return updatedCategory;
}

export async function deleteCategory(categoryId: string) {
	const [category] = await db
		.select()
		.from(categories)
		.where(eq(categories.id, categoryId))
		.limit(1);

	if (!category) {
		throw new NotFoundError("Nie znaleziono kategorii");
	}

	await db.delete(categories).where(eq(categories.id, categoryId));
}
