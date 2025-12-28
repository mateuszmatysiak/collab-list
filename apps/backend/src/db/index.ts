import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getEnv } from "../config/env";
import * as schema from "./schema";

type Database =
	| ReturnType<typeof drizzleNeon>
	| ReturnType<typeof drizzlePostgres>;

let _db: Database | null = null;

function getDatabase(): Database {
	if (!_db) {
		const env = getEnv();

		if (env.NODE_ENV === "production") {
			const client = neon(env.DATABASE_URL);
			_db = drizzleNeon(client, { schema });
		} else {
			const client = postgres(env.DATABASE_URL);
			_db = drizzlePostgres(client, { schema });
		}
	}

	return _db;
}

export const db = new Proxy({} as Database, {
	get(_target, prop) {
		return getDatabase()[prop as keyof Database];
	},
});
