import { hashPassword } from "../utils/password";
import { db } from "./index";
import {
	categories,
	categoryItems,
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
		await db.delete(categoryItems);
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
		console.log("📁 Tworzenie kategorii globalnych...");

		// Nabiał
		const [nabial] = await db
			.insert(categories)
			.values({ name: "Nabiał", icon: "Milk" })
			.returning();

		if (!nabial) throw new Error("Nie udało się utworzyć kategorii Nabiał");

		await db.insert(categoryItems).values([
			{ categoryId: nabial.id, name: "Mleko" },
			{ categoryId: nabial.id, name: "Ser żółty" },
			{ categoryId: nabial.id, name: "Ser biały" },
			{ categoryId: nabial.id, name: "Jogurt" },
			{ categoryId: nabial.id, name: "Śmietana" },
			{ categoryId: nabial.id, name: "Masło" },
			{ categoryId: nabial.id, name: "Jajka" },
			{ categoryId: nabial.id, name: "Twaróg" },
			{ categoryId: nabial.id, name: "Kefir" },
			{ categoryId: nabial.id, name: "Maślanka" },
		]);

		// Mięso
		const [mieso] = await db
			.insert(categories)
			.values({ name: "Mięso", icon: "Beef" })
			.returning();

		if (!mieso) throw new Error("Nie udało się utworzyć kategorii Mięso");

		await db.insert(categoryItems).values([
			{ categoryId: mieso.id, name: "Kurczak" },
			{ categoryId: mieso.id, name: "Wołowina" },
			{ categoryId: mieso.id, name: "Wieprzowina" },
			{ categoryId: mieso.id, name: "Indyk" },
			{ categoryId: mieso.id, name: "Szynka" },
			{ categoryId: mieso.id, name: "Kiełbasa" },
			{ categoryId: mieso.id, name: "Boczek" },
			{ categoryId: mieso.id, name: "Schab" },
			{ categoryId: mieso.id, name: "Filet z kurczaka" },
		]);

		// Owoce
		const [owoce] = await db
			.insert(categories)
			.values({ name: "Owoce", icon: "Apple" })
			.returning();

		if (!owoce) throw new Error("Nie udało się utworzyć kategorii Owoce");

		await db.insert(categoryItems).values([
			{ categoryId: owoce.id, name: "Jabłka" },
			{ categoryId: owoce.id, name: "Banany" },
			{ categoryId: owoce.id, name: "Pomarańcze" },
			{ categoryId: owoce.id, name: "Truskawki" },
			{ categoryId: owoce.id, name: "Winogrona" },
			{ categoryId: owoce.id, name: "Gruszki" },
			{ categoryId: owoce.id, name: "Śliwki" },
			{ categoryId: owoce.id, name: "Maliny" },
			{ categoryId: owoce.id, name: "Borówki" },
		]);

		// Warzywa
		const [warzywa] = await db
			.insert(categories)
			.values({ name: "Warzywa", icon: "Carrot" })
			.returning();

		if (!warzywa) throw new Error("Nie udało się utworzyć kategorii Warzywa");

		await db.insert(categoryItems).values([
			{ categoryId: warzywa.id, name: "Pomidory" },
			{ categoryId: warzywa.id, name: "Ogórki" },
			{ categoryId: warzywa.id, name: "Marchew" },
			{ categoryId: warzywa.id, name: "Cebula" },
			{ categoryId: warzywa.id, name: "Papryka" },
			{ categoryId: warzywa.id, name: "Sałata" },
			{ categoryId: warzywa.id, name: "Ziemniaki" },
			{ categoryId: warzywa.id, name: "Brokuły" },
			{ categoryId: warzywa.id, name: "Kalafior" },
		]);

		// Napoje
		const [napoje] = await db
			.insert(categories)
			.values({ name: "Napoje", icon: "Coffee" })
			.returning();

		if (!napoje) throw new Error("Nie udało się utworzyć kategorii Napoje");

		await db.insert(categoryItems).values([
			{ categoryId: napoje.id, name: "Woda" },
			{ categoryId: napoje.id, name: "Sok pomarańczowy" },
			{ categoryId: napoje.id, name: "Sok jabłkowy" },
			{ categoryId: napoje.id, name: "Kawa" },
			{ categoryId: napoje.id, name: "Herbata" },
			{ categoryId: napoje.id, name: "Cola" },
			{ categoryId: napoje.id, name: "Piwo" },
			{ categoryId: napoje.id, name: "Wino" },
			{ categoryId: napoje.id, name: "Napoje gazowane" },
		]);

		// Pieczywo
		const [pieczywo] = await db
			.insert(categories)
			.values({ name: "Pieczywo", icon: "Wheat" })
			.returning();

		if (!pieczywo) throw new Error("Nie udało się utworzyć kategorii Pieczywo");

		await db.insert(categoryItems).values([
			{ categoryId: pieczywo.id, name: "Chleb" },
			{ categoryId: pieczywo.id, name: "Bułki" },
			{ categoryId: pieczywo.id, name: "Bagietka" },
			{ categoryId: pieczywo.id, name: "Rogaliki" },
			{ categoryId: pieczywo.id, name: "Bułka tarta" },
			{ categoryId: pieczywo.id, name: "Tosty" },
		]);

		// Chemia
		const [chemia] = await db
			.insert(categories)
			.values({ name: "Chemia", icon: "SprayCan" })
			.returning();

		if (!chemia) throw new Error("Nie udało się utworzyć kategorii Chemia");

		await db.insert(categoryItems).values([
			{ categoryId: chemia.id, name: "Proszek do prania" },
			{ categoryId: chemia.id, name: "Płyn do naczyń" },
			{ categoryId: chemia.id, name: "Mydło" },
			{ categoryId: chemia.id, name: "Szampon" },
			{ categoryId: chemia.id, name: "Pasta do zębów" },
			{ categoryId: chemia.id, name: "Papier toaletowy" },
		]);

		// Słodycze
		const [slodycze] = await db
			.insert(categories)
			.values({ name: "Słodycze", icon: "Candy" })
			.returning();

		if (!slodycze) throw new Error("Nie udało się utworzyć kategorii Słodycze");

		await db.insert(categoryItems).values([
			{ categoryId: slodycze.id, name: "Czekolada" },
			{ categoryId: slodycze.id, name: "Ciastka" },
			{ categoryId: slodycze.id, name: "Cukierki" },
			{ categoryId: slodycze.id, name: "Lody" },
			{ categoryId: slodycze.id, name: "Batony" },
			{ categoryId: slodycze.id, name: "Wafle" },
		]);

		// Produkty sypkie
		const [sypkie] = await db
			.insert(categories)
			.values({ name: "Produkty sypkie", icon: "Package" })
			.returning();

		if (!sypkie)
			throw new Error("Nie udało się utworzyć kategorii Produkty sypkie");

		await db.insert(categoryItems).values([
			{ categoryId: sypkie.id, name: "Mąka" },
			{ categoryId: sypkie.id, name: "Cukier" },
			{ categoryId: sypkie.id, name: "Ryż" },
			{ categoryId: sypkie.id, name: "Makaron" },
			{ categoryId: sypkie.id, name: "Kasza" },
			{ categoryId: sypkie.id, name: "Płatki owsiane" },
			{ categoryId: sypkie.id, name: "Kasza gryczana" },
		]);

		console.log(`   ✓ 9 kategorii globalnych, 71 elementów\n`);

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
		console.log("   - 9 kategorii globalnych");
		console.log("   - 71 elementów kategorii\n");
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
