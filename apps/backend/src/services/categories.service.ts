import { eq, ilike, sql } from "drizzle-orm";
import { db } from "../db/index";
import { categories, categoryItems } from "../db/schema";
import { NotFoundError } from "../utils/errors";

export async function getAllCategories() {
	const allCategories = await db
		.select({
			id: categories.id,
			name: categories.name,
			icon: categories.icon,
			createdAt: categories.createdAt,
			itemsCount: sql<number>`count(${categoryItems.id})::int`,
		})
		.from(categories)
		.leftJoin(categoryItems, eq(categories.id, categoryItems.categoryId))
		.groupBy(categories.id)
		.orderBy(categories.name);

	return allCategories;
}

export async function getCategoryById(categoryId: string) {
	const [category] = await db
		.select()
		.from(categories)
		.where(eq(categories.id, categoryId))
		.limit(1);

	if (!category) {
		throw new NotFoundError("Nie znaleziono kategorii");
	}

	const items = await db
		.select()
		.from(categoryItems)
		.where(eq(categoryItems.categoryId, categoryId))
		.orderBy(categoryItems.name);

	return {
		...category,
		items,
		itemsCount: items.length,
	};
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

export async function getCategoryItems(categoryId: string) {
	const [category] = await db
		.select()
		.from(categories)
		.where(eq(categories.id, categoryId))
		.limit(1);

	if (!category) {
		throw new NotFoundError("Nie znaleziono kategorii");
	}

	const items = await db
		.select()
		.from(categoryItems)
		.where(eq(categoryItems.categoryId, categoryId))
		.orderBy(categoryItems.name);

	return items;
}

export async function createCategoryItem(categoryId: string, name: string) {
	const [category] = await db
		.select()
		.from(categories)
		.where(eq(categories.id, categoryId))
		.limit(1);

	if (!category) {
		throw new NotFoundError("Nie znaleziono kategorii");
	}

	const [item] = await db
		.insert(categoryItems)
		.values({
			categoryId,
			name,
		})
		.returning();

	return item;
}

export async function updateCategoryItem(itemId: string, name: string) {
	const [item] = await db
		.select()
		.from(categoryItems)
		.where(eq(categoryItems.id, itemId))
		.limit(1);

	if (!item) {
		throw new NotFoundError("Nie znaleziono elementu");
	}

	const [updatedItem] = await db
		.update(categoryItems)
		.set({ name })
		.where(eq(categoryItems.id, itemId))
		.returning();

	return updatedItem;
}

export async function deleteCategoryItem(itemId: string) {
	const [item] = await db
		.select()
		.from(categoryItems)
		.where(eq(categoryItems.id, itemId))
		.limit(1);

	if (!item) {
		throw new NotFoundError("Nie znaleziono elementu");
	}

	await db.delete(categoryItems).where(eq(categoryItems.id, itemId));
}

export async function searchCategoryItems(query: string) {
	const results = await db
		.select({
			id: categoryItems.id,
			categoryId: categoryItems.categoryId,
			name: categoryItems.name,
			createdAt: categoryItems.createdAt,
			categoryName: categories.name,
			categoryIcon: categories.icon,
		})
		.from(categoryItems)
		.innerJoin(categories, eq(categoryItems.categoryId, categories.id))
		.where(ilike(categoryItems.name, `%${query}%`))
		.orderBy(categoryItems.name)
		.limit(20);

	return results;
}
