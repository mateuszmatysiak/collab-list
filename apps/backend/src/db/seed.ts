import { hashPassword } from "../utils/password";
import { db } from "./index";
import {
	categories,
	listItems,
	listShares,
	lists,
	refreshTokens,
	users,
} from "./schema";

async function seed() {
	console.log("🌱 Rozpoczynam resetowanie i wypełnianie bazy danych...\n");

	try {
		// Resetowanie bazy danych
		console.log("🗑️  Czyszczenie istniejących danych...");
		await db.delete(refreshTokens);
		await db.delete(listItems);
		await db.delete(listShares);
		await db.delete(lists);
		await db.delete(categories);
		await db.delete(users);
		console.log("   ✓ Baza danych wyczyszczona\n");

		// Tworzenie użytkowników
		console.log("👤 Tworzenie użytkowników...");
		const passwordHash = await hashPassword("haslo123");

		const [jan] = await db
			.insert(users)
			.values({
				name: "Jan Kowalski",
				email: "jan@example.com",
				passwordHash,
			})
			.returning();

		const [anna] = await db
			.insert(users)
			.values({
				name: "Anna Nowak",
				email: "anna@example.com",
				passwordHash,
			})
			.returning();

		const [piotr] = await db
			.insert(users)
			.values({
				name: "Piotr Wiśniewski",
				email: "piotr@example.com",
				passwordHash,
			})
			.returning();

		const [maria] = await db
			.insert(users)
			.values({
				name: "Maria Zielińska",
				email: "maria@example.com",
				passwordHash,
			})
			.returning();

		const [tomasz] = await db
			.insert(users)
			.values({
				name: "Tomasz Nowy",
				email: "tomasz@example.com",
				passwordHash,
			})
			.returning();

		if (!jan || !anna || !piotr || !maria || !tomasz) {
			throw new Error("Nie udało się utworzyć użytkowników");
		}

		console.log(`   ✓ Utworzono 5 użytkowników\n`);

		// ========== KATEGORIE GLOBALNE ==========
		console.log("📁 Tworzenie kategorii...");

		const [nabial] = await db
			.insert(categories)
			.values({ name: "Nabiał", icon: "Milk" })
			.returning();

		const [mieso] = await db
			.insert(categories)
			.values({ name: "Mięso", icon: "Beef" })
			.returning();

		const [owoce] = await db
			.insert(categories)
			.values({ name: "Owoce", icon: "Apple" })
			.returning();

		const [warzywa] = await db
			.insert(categories)
			.values({ name: "Warzywa", icon: "Carrot" })
			.returning();

		const [napoje] = await db
			.insert(categories)
			.values({ name: "Napoje", icon: "Coffee" })
			.returning();

		const [pieczywo] = await db
			.insert(categories)
			.values({ name: "Pieczywo", icon: "Wheat" })
			.returning();

		const [chemia] = await db
			.insert(categories)
			.values({ name: "Chemia", icon: "SprayCan" })
			.returning();

		const [slodycze] = await db
			.insert(categories)
			.values({ name: "Słodycze", icon: "Candy" })
			.returning();

		const [sypkie] = await db
			.insert(categories)
			.values({ name: "Produkty sypkie", icon: "Package" })
			.returning();

		if (
			!nabial ||
			!mieso ||
			!owoce ||
			!warzywa ||
			!napoje ||
			!pieczywo ||
			!chemia ||
			!slodycze ||
			!sypkie
		) {
			throw new Error("Nie udało się utworzyć kategorii");
		}

		console.log(`   ✓ 9 kategorii\n`);

		// ========== LISTY JANA ==========
		console.log("📋 Tworzenie list dla Jana...");

		const [janZakupy] = await db
			.insert(lists)
			.values({ name: "Zakupy spożywcze", authorId: jan.id })
			.returning();

		const [janZadania] = await db
			.insert(lists)
			.values({ name: "Zadania domowe", authorId: jan.id })
			.returning();

		const [janProjekt] = await db
			.insert(lists)
			.values({ name: "Projekt zespołowy", authorId: jan.id })
			.returning();

		if (!janZakupy || !janZadania || !janProjekt) {
			throw new Error("Nie udało się utworzyć list Jana");
		}

		// Elementy list Jana
		await db.insert(listItems).values([
			{
				listId: janZakupy.id,
				title: "Chleb",
				isCompleted: true,
				categoryId: pieczywo.id,
			},
			{
				listId: janZakupy.id,
				title: "Mleko",
				isCompleted: false,
				categoryId: nabial.id,
			},
			{
				listId: janZakupy.id,
				title: "Jajka",
				isCompleted: false,
				categoryId: nabial.id,
			},
			{
				listId: janZakupy.id,
				title: "Ser żółty",
				isCompleted: true,
				categoryId: nabial.id,
			},
			{ listId: janZadania.id, title: "Posprzątać pokój", isCompleted: false },
			{ listId: janZadania.id, title: "Wynieść śmieci", isCompleted: true },
			{ listId: janZadania.id, title: "Umyć naczynia", isCompleted: false },
			{
				listId: janProjekt.id,
				title: "Przygotować prezentację",
				isCompleted: false,
			},
			{ listId: janProjekt.id, title: "Wysłać raport", isCompleted: true },
			{
				listId: janProjekt.id,
				title: "Spotkanie z zespołem",
				isCompleted: false,
			},
		]);

		// Udostępnienia list Jana
		await db.insert(listShares).values([
			{ listId: janZakupy.id, userId: anna.id, role: "editor" },
			{ listId: janZakupy.id, userId: piotr.id, role: "editor" },
			{ listId: janProjekt.id, userId: anna.id, role: "editor" },
			{ listId: janProjekt.id, userId: maria.id, role: "editor" },
		]);

		console.log(`   ✓ 3 listy, 10 elementów, 4 udostępnienia\n`);

		// ========== LISTY ANNY ==========
		console.log("📋 Tworzenie list dla Anny...");

		const [annaUrodziny] = await db
			.insert(lists)
			.values({ name: "Prezenty urodzinowe", authorId: anna.id })
			.returning();

		const [annaWakacje] = await db
			.insert(lists)
			.values({ name: "Lista na wakacje", authorId: anna.id })
			.returning();

		if (!annaUrodziny || !annaWakacje) {
			throw new Error("Nie udało się utworzyć list Anny");
		}

		await db.insert(listItems).values([
			{ listId: annaUrodziny.id, title: "Książka dla mamy", isCompleted: true },
			{
				listId: annaUrodziny.id,
				title: "Perfumy dla taty",
				isCompleted: false,
			},
			{
				listId: annaUrodziny.id,
				title: "Zabawka dla siostrzeńca",
				isCompleted: false,
			},
			{ listId: annaWakacje.id, title: "Paszport", isCompleted: true },
			{ listId: annaWakacje.id, title: "Krem z filtrem", isCompleted: true },
			{ listId: annaWakacje.id, title: "Ładowarka", isCompleted: false },
			{ listId: annaWakacje.id, title: "Apteczka", isCompleted: false },
		]);

		await db.insert(listShares).values([
			{ listId: annaUrodziny.id, userId: jan.id, role: "editor" },
			{ listId: annaWakacje.id, userId: piotr.id, role: "editor" },
			{ listId: annaWakacje.id, userId: maria.id, role: "editor" },
		]);

		console.log(`   ✓ 2 listy, 7 elementów, 3 udostępnienia\n`);

		// ========== LISTY PIOTRA ==========
		console.log("📋 Tworzenie list dla Piotra...");

		const [piotrTrening] = await db
			.insert(lists)
			.values({ name: "Plan treningowy", authorId: piotr.id })
			.returning();

		const [piotrKsiazki] = await db
			.insert(lists)
			.values({ name: "Książki do przeczytania", authorId: piotr.id })
			.returning();

		const [piotrRemont] = await db
			.insert(lists)
			.values({ name: "Remont mieszkania", authorId: piotr.id })
			.returning();

		if (!piotrTrening || !piotrKsiazki || !piotrRemont) {
			throw new Error("Nie udało się utworzyć list Piotra");
		}

		await db.insert(listItems).values([
			{ listId: piotrTrening.id, title: "Bieganie 5km", isCompleted: true },
			{ listId: piotrTrening.id, title: "Siłownia", isCompleted: false },
			{ listId: piotrTrening.id, title: "Joga", isCompleted: false },
			{
				listId: piotrKsiazki.id,
				title: "Władca Pierścieni",
				isCompleted: true,
			},
			{ listId: piotrKsiazki.id, title: "Dune", isCompleted: false },
			{ listId: piotrKsiazki.id, title: "1984", isCompleted: false },
			{ listId: piotrRemont.id, title: "Kupić farbę", isCompleted: true },
			{ listId: piotrRemont.id, title: "Pomalować ściany", isCompleted: false },
			{ listId: piotrRemont.id, title: "Wymienić podłogę", isCompleted: false },
			{ listId: piotrRemont.id, title: "Nowe meble", isCompleted: false },
		]);

		await db.insert(listShares).values([
			{ listId: piotrTrening.id, userId: jan.id, role: "editor" },
			{ listId: piotrRemont.id, userId: anna.id, role: "editor" },
			{ listId: piotrRemont.id, userId: maria.id, role: "editor" },
		]);

		console.log(`   ✓ 3 listy, 10 elementów, 3 udostępnienia\n`);

		// ========== LISTY MARII ==========
		console.log("📋 Tworzenie list dla Marii...");

		const [mariaEventy] = await db
			.insert(lists)
			.values({ name: "Organizacja eventu", authorId: maria.id })
			.returning();

		const [mariaPrzepisy] = await db
			.insert(lists)
			.values({ name: "Przepisy kulinarne", authorId: maria.id })
			.returning();

		if (!mariaEventy || !mariaPrzepisy) {
			throw new Error("Nie udało się utworzyć list Marii");
		}

		await db.insert(listItems).values([
			{ listId: mariaEventy.id, title: "Zarezerwować salę", isCompleted: true },
			{ listId: mariaEventy.id, title: "Zamówić catering", isCompleted: true },
			{
				listId: mariaEventy.id,
				title: "Wysłać zaproszenia",
				isCompleted: false,
			},
			{ listId: mariaEventy.id, title: "DJ na imprezę", isCompleted: false },
			{ listId: mariaPrzepisy.id, title: "Sernik", isCompleted: true },
			{ listId: mariaPrzepisy.id, title: "Pierogi", isCompleted: false },
			{ listId: mariaPrzepisy.id, title: "Bigos", isCompleted: false },
		]);

		await db.insert(listShares).values([
			{ listId: mariaEventy.id, userId: jan.id, role: "editor" },
			{ listId: mariaEventy.id, userId: anna.id, role: "editor" },
			{ listId: mariaEventy.id, userId: piotr.id, role: "editor" },
			{ listId: mariaPrzepisy.id, userId: anna.id, role: "editor" },
		]);

		console.log(`   ✓ 2 listy, 7 elementów, 4 udostępnienia\n`);

		// Podsumowanie
		console.log("✨ Baza danych została zresetowana i wypełniona!\n");
		console.log("📊 Podsumowanie:");
		console.log("   - 5 użytkowników");
		console.log("   - 10 list");
		console.log("   - 34 elementy list");
		console.log("   - 14 udostępnień");
		console.log("   - 9 kategorii\n");
		console.log("📝 Konta użytkowników (hasło: haslo123):");
		console.log("   - jan@example.com");
		console.log("   - anna@example.com");
		console.log("   - piotr@example.com");
		console.log("   - maria@example.com");
		console.log("   - tomasz@example.com (pusta baza danych)\n");
		process.exit(0);
	} catch (error) {
		console.error("❌ Błąd podczas wypełniania bazy danych:", error);
		process.exit(1);
	}
}

seed();
