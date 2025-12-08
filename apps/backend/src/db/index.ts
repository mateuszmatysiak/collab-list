import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getEnv } from "../config/env";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

function getDatabase() {
	if (!_db) {
		_client = postgres(getEnv().DATABASE_URL);
		_db = drizzle(_client, { schema });
	}

	return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
	get(_target, prop) {
		return getDatabase()[prop as keyof ReturnType<typeof drizzle>];
	},
});
