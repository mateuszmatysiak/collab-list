import {
	boolean,
	index,
	pgEnum,
	pgTable,
	timestamp,
	unique,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["owner", "editor"]);

export const users = pgTable(
	"users",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: varchar("name", { length: 255 }).notNull(),
		email: varchar("email", { length: 255 }).notNull().unique(),
		passwordHash: varchar("password_hash", { length: 255 }).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [index("users_email_idx").on(table.email)],
);

export const lists = pgTable(
	"lists",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: varchar("name", { length: 500 }).notNull(),
		authorId: uuid("author_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [index("lists_author_id_idx").on(table.authorId)],
);

export const listItems = pgTable(
	"list_items",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		listId: uuid("list_id")
			.notNull()
			.references(() => lists.id, { onDelete: "cascade" }),
		title: varchar("title", { length: 1000 }).notNull(),
		isCompleted: boolean("is_completed").default(false).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [index("list_items_list_id_idx").on(table.listId)],
);

export const listShares = pgTable(
	"list_shares",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		listId: uuid("list_id")
			.notNull()
			.references(() => lists.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		role: roleEnum("role").default("editor").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("list_shares_list_user_idx").on(table.listId, table.userId),
		unique("list_shares_unique_list_user_idx").on(table.listId, table.userId),
	],
);

export const refreshTokens = pgTable(
	"refresh_tokens",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		token: varchar("token", { length: 500 }).notNull().unique(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("refresh_tokens_user_id_idx").on(table.userId),
		index("refresh_tokens_token_idx").on(table.token),
	],
);
