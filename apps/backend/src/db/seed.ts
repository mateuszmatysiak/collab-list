import { hashPassword } from "../utils/password";
import { db } from "./index";
import {
	refreshTokens,
	systemCategories,
	userCategories,
	users,
} from "./schema";

const SYSTEM_CATEGORIES = [
	{ name: "Nabiał", icon: "Milk" },
	{ name: "Mięso", icon: "Beef" },
	{ name: "Owoce", icon: "Apple" },
	{ name: "Warzywa", icon: "Carrot" },
	{ name: "Napoje", icon: "Coffee" },
	{ name: "Pieczywo", icon: "Wheat" },
	{ name: "Chemia", icon: "SprayCan" },
	{ name: "Słodycze", icon: "Candy" },
	{ name: "Produkty sypkie", icon: "Package" },
] as const;

async function copySystemCategoriesToUser(
	userId: string,
	systemCats: Array<{ id: string; name: string; icon: string }>,
): Promise<Map<string, string>> {
	const categoryMapping = new Map<string, string>();

	for (const sysCat of systemCats) {
		const [userCat] = await db
			.insert(userCategories)
			.values({
				userId,
				name: sysCat.name,
				icon: sysCat.icon,
				listId: null,
			})
			.returning();

		if (userCat) {
			categoryMapping.set(sysCat.id, userCat.id);
		}
	}

	return categoryMapping;
}

async function seed() {
	console.log("🌱 Rozpoczynam resetowanie i wypełnianie bazy danych...\n");

	try {
		console.log("🗑️  Czyszczenie istniejących danych...");
		await db.delete(refreshTokens);
		await db.delete(userCategories);
		await db.delete(systemCategories);
		await db.delete(users);
		console.log("   ✓ Baza danych wyczyszczona\n");

		console.log("📁 Tworzenie kategorii systemowych...");

		const createdSystemCategories: Array<{
			id: string;
			name: string;
			icon: string;
		}> = [];

		for (const cat of SYSTEM_CATEGORIES) {
			const [created] = await db
				.insert(systemCategories)
				.values({ name: cat.name, icon: cat.icon })
				.returning();

			if (created) {
				createdSystemCategories.push(created);
			}
		}

		if (createdSystemCategories.length !== SYSTEM_CATEGORIES.length) {
			throw new Error(
				"Nie udało się utworzyć wszystkich kategorii systemowych",
			);
		}

		console.log(
			`   ✓ ${createdSystemCategories.length} kategorii systemowych\n`,
		);

		console.log("👤 Tworzenie użytkowników...");
		const passwordHash = await hashPassword("haslo123");

		const [x] = await db
			.insert(users)
			.values({
				name: "X",
				login: "x",
				passwordHash,
			})
			.returning();

		const [y] = await db
			.insert(users)
			.values({
				name: "Y",
				login: "y",
				passwordHash,
			})
			.returning();

		if (!x || !y) {
			throw new Error("Nie udało się utworzyć użytkowników");
		}

		console.log(`   ✓ Utworzono 2 użytkowników\n`);

		console.log("📁 Kopiowanie kategorii systemowych do użytkowników...");

		await copySystemCategoriesToUser(x.id, createdSystemCategories);
		await copySystemCategoriesToUser(y.id, createdSystemCategories);

		console.log(`   ✓ Skopiowano kategorie dla 2 użytkowników\n`);

		console.log("✨ Baza danych została zresetowana i wypełniona!\n");
		console.log("📊 Podsumowanie:");
		console.log("   - 2 użytkowników");
		console.log("   - 9 kategorii systemowych");
		console.log("   - 18 kategorii użytkowników (9 x 2 użytkowników)\n");
		console.log("📝 Konta użytkowników (hasło: haslo123):");
		console.log("   - x (pusta baza danych)");
		console.log("   - y (pusta baza danych)\n");
		process.exit(0);
	} catch (error) {
		console.error("❌ Błąd podczas wypełniania bazy danych:", error);
		process.exit(1);
	}
}

seed();
