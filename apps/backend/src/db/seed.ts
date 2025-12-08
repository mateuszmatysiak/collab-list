import { eq } from "drizzle-orm";
import { hashPassword } from "../utils/password";
import { db } from "./index";
import { listItems, listShares, lists, users } from "./schema";

async function seed() {
	console.log(
		"🌱 Rozpoczynam wypełnianie bazy danych przykładowymi danymi...\n",
	);

	try {
		// Sprawdź czy przykładowi użytkownicy już istnieją
		const existingUser1 = await db
			.select()
			.from(users)
			.where(eq(users.email, "jan@example.com"))
			.limit(1);

		if (existingUser1.length > 0) {
			console.log("⚠️  Przykładowe dane już istnieją w bazie danych.");
			console.log("   Skrypt został pominięty, aby uniknąć duplikatów.\n");
			return;
		}

		// Tworzenie przykładowych użytkowników
		console.log("👤 Tworzenie przykładowych użytkowników...");
		const passwordHash = await hashPassword("haslo123");

		const [user1] = await db
			.insert(users)
			.values({
				name: "Jan Kowalski",
				email: "jan@example.com",
				passwordHash,
			})
			.returning();

		if (!user1) throw new Error("Nie udało się utworzyć user1");

		const [user2] = await db
			.insert(users)
			.values({
				name: "Anna Nowak",
				email: "anna@example.com",
				passwordHash,
			})
			.returning();

		if (!user2) throw new Error("Nie udało się utworzyć user2");

		const [user3] = await db
			.insert(users)
			.values({
				name: "Piotr Wiśniewski",
				email: "piotr@example.com",
				passwordHash,
			})
			.returning();

		if (!user3) throw new Error("Nie udało się utworzyć user3");

		console.log(`   ✓ Utworzono 3 użytkowników\n`);

		// Tworzenie przykładowych list
		console.log("📋 Tworzenie przykładowych list...");

		const [list1] = await db
			.insert(lists)
			.values({
				name: "Zakupy spożywcze",
				authorId: user1.id,
			})
			.returning();

		if (!list1) throw new Error("Nie udało się utworzyć list1");

		const [list2] = await db
			.insert(lists)
			.values({
				name: "Zadania do wykonania",
				authorId: user1.id,
			})
			.returning();

		if (!list2) throw new Error("Nie udało się utworzyć list2");

		const [list3] = await db
			.insert(lists)
			.values({
				name: "Prezenty na urodziny",
				authorId: user2.id,
			})
			.returning();

		if (!list3) throw new Error("Nie udało się utworzyć list3");

		const [list4] = await db
			.insert(lists)
			.values({
				name: "Projekty do zrealizowania",
				authorId: user2.id,
			})
			.returning();

		if (!list4) throw new Error("Nie udało się utworzyć list4");

		console.log(`   ✓ Utworzono 4 listy\n`);

		// Tworzenie przykładowych elementów list
		console.log("✅ Tworzenie przykładowych elementów list...");

		await db.insert(listItems).values([
			{
				listId: list1.id,
				title: "Chleb",
				isCompleted: false,
			},
			{
				listId: list1.id,
				title: "Mleko",
				isCompleted: true,
			},
			{
				listId: list1.id,
				title: "Jajka",
				isCompleted: false,
			},
			{
				listId: list1.id,
				title: "Masło",
				isCompleted: false,
			},
			{
				listId: list2.id,
				title: "Zadzwonić do dentysty",
				isCompleted: false,
			},
			{
				listId: list2.id,
				title: "Odebrać paczkę",
				isCompleted: true,
			},
			{
				listId: list2.id,
				title: "Zapłacić rachunki",
				isCompleted: false,
			},
			{
				listId: list3.id,
				title: "Książka",
				isCompleted: false,
			},
			{
				listId: list3.id,
				title: "Koszulka",
				isCompleted: false,
			},
			{
				listId: list3.id,
				title: "Kwiaty",
				isCompleted: true,
			},
			{
				listId: list4.id,
				title: "Zaktualizować dokumentację",
				isCompleted: false,
			},
			{
				listId: list4.id,
				title: "Przeprowadzić testy",
				isCompleted: false,
			},
			{
				listId: list4.id,
				title: "Code review",
				isCompleted: true,
			},
		]);

		console.log(`   ✓ Utworzono 13 elementów list\n`);

		// Tworzenie przykładowych udostępnień
		console.log("🔗 Tworzenie przykładowych udostępnień...");

		await db.insert(listShares).values([
			{
				listId: list1.id,
				userId: user2.id,
				role: "editor",
			},
			{
				listId: list1.id,
				userId: user3.id,
				role: "editor",
			},
			{
				listId: list2.id,
				userId: user2.id,
				role: "owner",
			},
			{
				listId: list3.id,
				userId: user1.id,
				role: "editor",
			},
			{
				listId: list4.id,
				userId: user3.id,
				role: "editor",
			},
		]);

		console.log(`   ✓ Utworzono 5 udostępnień\n`);

		console.log(
			"✨ Baza danych została pomyślnie wypełniona przykładowymi danymi!\n",
		);
		console.log("📝 Przykładowe konta użytkowników:");
		console.log("   - jan@example.com / haslo123");
		console.log("   - anna@example.com / haslo123");
		console.log("   - piotr@example.com / haslo123\n");
	} catch (error) {
		console.error("❌ Błąd podczas wypełniania bazy danych:", error);
		process.exit(1);
	}
}

seed();
