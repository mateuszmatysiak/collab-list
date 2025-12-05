import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
import { getEnv } from "./src/config/env";

dotenv.config();

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: getEnv().DATABASE_URL,
	},
});
