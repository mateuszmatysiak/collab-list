import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL: z.string().min(1),
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	JWT_SECRET: z.string().min(32),
	PORT: z.coerce.number().min(1).max(65535).default(3000),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

export function getEnv(): Env {
	if (!env) {
		env = envSchema.parse(process.env);
	}
	return env;
}
